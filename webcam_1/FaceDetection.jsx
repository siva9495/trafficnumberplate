import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { storage, ref, getDownloadURL } from '../src/firebase';
import { uploadBytes } from 'firebase/storage';

const FaceRecognition = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [facesData, setFacesData] = useState([]);
  const [recognizedFaces, setRecognizedFaces] = useState([]);
  const [crimeDB, setCrimeDB] = useState();
  const buzzerRef = useRef(null);

  useEffect(() => {
    buzzerRef.current = new Audio('/audio/dangerAlarm.mp3');
    buzzerRef.current.addEventListener('canplaythrough', () => console.log('Audio loaded successfully.'));
    buzzerRef.current.addEventListener('error', (e) => console.error('Error loading audio file:', e));
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models'); // Ensure this model is also loaded
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => console.error('Error accessing video stream:', err));
    };

    loadModels().then(startVideo);

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handleVideoPlay = () => {
      const intervalId = setInterval(async () => {
        if (!facesData.length) return; // Ensure facesData is loaded

        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length > 0) {
          console.log("Detections made:", detections);

          const faceMatcher = new faceapi.FaceMatcher(facesData, 0.6);
          const recognized = detections.map(detection => {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            return {
              detection: detection,
              match: bestMatch
            };
          });

          drawResults(recognized);
          setRecognizedFaces(recognized);

          recognized.forEach(({ detection, match }) => {
            if (match.label !== 'unknown') {
              captureAndSaveImage(detection.detection.box, match.label);
              buzzerRef.current.play().catch(err => console.error('Error playing audio:', err)); // Play buzzer sound when a criminal is detected
            }
          });

        } else {
          console.log("No detections");
          drawResults([]);
        }
      }, 500); // Reduced interval for more frequent detection

      return () => clearInterval(intervalId);
    };

    videoRef.current && videoRef.current.addEventListener('play', handleVideoPlay);

    return () => {
      videoRef.current && videoRef.current.removeEventListener('play', handleVideoPlay);
    };
  }, [facesData]);

  const fetchFacesData = async () => {
    try {
      const storageRef = ref(storage, 'faces.json');
      const downloadURL = await getDownloadURL(storageRef);
      const response = await fetch(downloadURL);
      if (!response.ok) {
        throw new Error('Failed to fetch faces data');
      }
      const jsonData = await response.json();
      setCrimeDB(jsonData);
      return jsonData;
    } catch (error) {
      console.error('Error fetching faces data:', error.message);
      return [];
    }
  };

  useEffect(() => {
    fetchFacesData().then(data => {
      console.log("data", Object.keys(data).length); // This will print the length of the data object
      if (Object.keys(data).length > 0) {
        const labeledDescriptorsPromises = Object.values(data).map(async face => {
          const img = await faceapi.fetchImage(face.imageUrl);
          const detections = await faceapi.detectAllFaces(img, new faceapi.SsdMobilenetv1Options()) // Use the loaded model for detection
            .withFaceLandmarks()
            .withFaceDescriptors();

          if (detections.length > 0) {
            const descriptors = [detections[0].descriptor];
            return new faceapi.LabeledFaceDescriptors(face.title, descriptors);
          } else {
            return null;
          }
        });

        Promise.all(labeledDescriptorsPromises).then(labeledDescriptors => {
          setFacesData(labeledDescriptors.filter(ld => ld !== null));
        });
      }
    });
  }, []);

  const drawResults = (recognized) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.matchDimensions(canvas, videoRef.current);

    if (recognized.length === 0) {
      ctx.font = '24px Arial';
      ctx.fillStyle = 'green';
      ctx.fillText('Unknown', canvas.width / 2 - 50, canvas.height / 2);
      return;
    }

    recognized.forEach(({ detection, match }) => {
      const box = detection.detection.box;
      const { label, distance } = match;

      ctx.beginPath();
      ctx.lineWidth = '2';

      if (label === 'unknown') {
        ctx.strokeStyle = 'green';
        ctx.fillStyle = 'green';
      } else {
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
      }

      ctx.rect(box.x, box.y, box.width, box.height);
      ctx.stroke();

      ctx.font = '16px Arial';

      if (label === 'unknown') {
        ctx.fillStyle = 'green';
        ctx.fillText('Unknown', box.x, box.y - 10, box.width, box.height);
      } else {
        ctx.fillText(`${label} (${distance.toFixed(2)})`, box.x, box.y - 10);

        const criminalData = facesData.find(face => face.label === label);

        Object.values(crimeDB).forEach((eachCrime) => {
          if (eachCrime.title === criminalData.label) {
            ctx.fillText(`Name: ${eachCrime.title}`, box.x, box.y + box.height + 20);
            ctx.fillText(`Case Number: ${eachCrime.caseNumber}`, box.x, box.y + box.height + 40);
            ctx.fillText(`Crime: ${eachCrime.crime}`, box.x, box.y + box.height + 60);
            ctx.fillText(`Parole: ${eachCrime.parole}`, box.x, box.y + box.height + 80);

            const imageObj = new Image();
            imageObj.onload = function () {
              ctx.drawImage(imageObj, box.x + box.width + 10, box.y, 100, 100);
            };
            imageObj.src = criminalData.imageUrl;
          }
        });
      }
    });
  };

  const captureAndSaveImage = async (box, label) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = box.width;
    canvas.height = box.height;

    ctx.drawImage(video, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);

    canvas.toBlob(async (blob) => {
      const storageRef = ref(storage, `detectedCriminal/${label}_${Date.now()}.png`);
      try {
        await uploadBytes(storageRef, blob);
        console.log(`Image of ${label} saved successfully.`);
      } catch (error) {
        console.error('Error saving image:', error.message);
      }
    }, 'image/png');
  };

  return (
    <div>
      <video ref={videoRef} width="720" height="560" autoPlay muted />
      <canvas ref={canvasRef} width="720" height="560" style={{ position: 'absolute', top: 0, left: 0 }} />
      <div>
        {recognizedFaces.map((face, i) => (
          <div key={i}>
            {face.match.toString()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;
