// TestStreamAccess.jsx

import React, { useRef, useEffect } from 'react';

const TestStreamAccess = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        // Use a CORS proxy service or a proxy server
        // const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
        const streamUrl = 'http://192.168.0.202/'; // Replace with your actual camera stream URL

        fetch(streamUrl, {
            headers: {
                'Origin': 'http://localhost:5173' // Replace with your React app's origin
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response;
        })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            videoElement.src = url;
        })
        .catch(error => {
            console.error('Error fetching camera stream:', error);
        });

        return () => {
            if (videoElement.srcObject) {
                videoElement.srcObject = null;
            }
        };
    }, []);

    return (
        <div>
            <h1>Camera Stream</h1>
            <video ref={videoRef} controls autoPlay className="camera-stream" />
        </div>
    );
};

export default TestStreamAccess;
