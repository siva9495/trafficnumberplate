import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrafficDepartmentV2.css';
import govteltrafficimg from '../../images/govteltrafficnobg.png';
import { getDatabase, ref, onValue, set, push, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Toaster, toast } from 'react-hot-toast';

const TrafficDepartmentV2 = () => {
  const [carDetails, setCarDetails] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredCarDetails, setFilteredCarDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [reasonForChallan, setReasonForChallan] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleImage, setVehicleImage] = useState(null);
  const [vehicleImageName, setVehicleImageName] = useState('');
  const [evidenceImages, setEvidenceImages] = useState([]);
  const [evidenceImageNames, setEvidenceImageNames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const database = getDatabase();
    const carDetailsRef = ref(database, 'trafficcardetails');
    onValue(carDetailsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const carDetailsArray = Object.values(data);
        setCarDetails(carDetailsArray);
        setFilteredCarDetails(carDetailsArray);
      }
    });
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchInput.toLowerCase();
    const filteredData = carDetails.filter(item =>
      item.NumberPlate.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredCarDetails(filteredData);
  }, [searchInput, carDetails]);

  const handleCardClick = (carNumber) => {
    navigate(`/card-details/${carNumber}`);
  };

  const handleAddTrafficDetails = () => {
    setShowModal(true);
  };

  const handleReasonClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionSelect = (option) => {
    setReasonForChallan(option);
    setShowDropdown(false);
  };

  const handleVehicleImageChange = (e) => {
    const file = e.target.files[0];
    setVehicleImage(file);
    setVehicleImageName(file.name);
  };

  const handleEvidenceImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setEvidenceImages(files);
    setEvidenceImageNames(files.map(file => file.name));
  };

  const handleAddTrafficDetailsSubmit = async () => {
    if (!vehicleNumber || !date || !time || !vehicleImage || evidenceImages.length === 0 || !reasonForChallan) {
      toast.error("All fields are required");
      return;
    }

    const database = getDatabase();
    const carDetailsRef = ref(database, 'trafficcardetails');
    const snapshot = await get(carDetailsRef);
    const carDetailsData = snapshot.val();
    const vehicleExists = carDetailsData && Object.values(carDetailsData).some(detail => detail.NumberPlate === vehicleNumber);

    const saveTrafficDetails = async () => {
      const storage = getStorage();
      const timestamp = Date.now();
      const carImageRef = storageRef(storage, `images/${timestamp}_${vehicleImage.name}`);
      const evidenceImageRefs = evidenceImages.map((image, index) => storageRef(storage, `evidences/${timestamp}_${index}_${image.name}`));

      // Upload vehicle image
      await uploadBytes(carImageRef, vehicleImage);
      const carImageUrl = await getDownloadURL(carImageRef);

      // Upload evidence images
      const evidenceImageUrls = await Promise.all(evidenceImageRefs.map((ref, index) => uploadBytes(ref, evidenceImages[index]).then(() => getDownloadURL(ref))));

      // Save car details only if it doesn't already exist
      if (!vehicleExists) {
        const newCarDetailRef = push(ref(database, 'trafficcardetails'));
        await set(newCarDetailRef, { NumberPlate: vehicleNumber });
      }

      // Save car image details
      const newCarImageRef = push(ref(database, 'images'));
      await set(newCarImageRef, {
        CarImageUniqueID: timestamp,
        Date: date,
        Image: carImageUrl,
        Result: vehicleNumber,
        Time: time
      });

      // Save evidence images details
      const evidenceDetails = evidenceImageUrls.map((url, index) => ({
        Date: date,
        Image: url,
        Time: time,
        sno: index + 1
      }));
      const evidenceRef = ref(database, `evidences/${vehicleNumber}/${timestamp}`);
      await Promise.all(evidenceDetails.map(detail => push(evidenceRef, detail)));

      // Save reason for challan
      const reasonRef = ref(database, `reason-for-challan/${vehicleNumber}/${timestamp}`);
      await set(reasonRef, {
        date: date,
        reason: reasonForChallan,
        time: time
      });

      setShowModal(false);
    };

    toast.promise(
      saveTrafficDetails(),
      {
        loading: 'Saving...',
        success: <b>Traffic details added successfully!</b>,
        error: <b>An error occurred while adding traffic details.</b>,
      }
    );
  };

  const options = [
    'Unsafe Lane Changes',
    'Driving Under the Influence (DUI)',
    'No side mirrors',
    'Expired or Invalid License/Registration'
  ];

  return (
    <div className='traffic_department_v2_container'>
      <Toaster position="top-right" reverseOrder={false} />
      <div className='div_title_traffic'>
        <span className='title_traffic'>Traffic Vehicle Details</span>
        <div className='div_searchaddtraffic'>
          <div className='div_search_car_number'>
            <i>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <g clipPath="url(#clip0_128_256)">
                  <path d="M5.95 10.5263C3.4412 10.5263 1.4 8.48 1.4 5.96491C1.4 3.44982 3.4412 1.40351 5.95 1.40351C8.4588 1.40351 10.5 3.44982 10.5 5.96491C10.5 8.48 8.4588 10.5263 5.95 10.5263ZM10.7443 9.48281C11.4674 8.49474 11.9 7.2814 11.9 5.96491C11.9 2.67579 9.2309 0 5.95 0C2.6691 0 0 2.67579 0 5.96491C0 9.25403 2.6691 11.9298 5.95 11.9298C7.4137 11.9298 8.7542 11.3944 9.7909 10.5116L12.2528 12.9796C12.3893 13.1165 12.5685 13.1853 12.7477 13.1853C12.9269 13.1853 13.1061 13.1165 13.2426 12.9796C13.5163 12.7053 13.5163 12.2618 13.2426 11.9874L10.7443 9.48281Z" fill="#999999"/>
                </g>
                <defs>
                  <clipPath id="clip0_128_256">
                    <rect width="14" height="14" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </i>
            <input
              type="text"
              placeholder="Car Number"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value.toUpperCase())}
            ></input>
          </div>
          <button className='btn_addtrafficdetails' onClick={handleAddTrafficDetails}>Add Traffic Details</button>
        </div>
      </div>
      <div className='div_table_car_details'>
        {filteredCarDetails.map((car, index) => (
          <div key={index} className='car_number_cards' onClick={() => handleCardClick(car.NumberPlate)}>
            <div className='car_number_title'>
              <span className='text_car_number'>{car.NumberPlate}</span>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className='modal_addtraffic'>
            <div className='modal_content_addtraffic'>
              <div className='modal_upper_buttons_addtraffic'>
                <img className='modal_img_upper_govteltraffic' src={govteltrafficimg} />
                <span className="modal_close_traffic" onClick={() => setShowModal(false)}><span className='span_close_traffic'>&times;</span></span>
              </div>
              <div className='modal_title_addtraffic'>
                <span className='modal_title_text_addtraffic'>Traffic Details</span>
              </div>
              <div className='div_addtraffic_modal_fr01'>
                  <div className='div_addtraffic_fr01_inner01'>
                      <span className='addtraffic_span_fr01_inner01'>Date</span>
                      <div className='input_container'>
                      <input 
                        className='addtraffic_input_fr01_inner01' 
                        type="text" 
                        name="date" 
                        placeholder="Choose date"  
                        value={date}
                        onChange={e => setDate(e.target.value)}
                      />
                      </div>
                  </div>
                  <div className='div_fr01_inner02'>
                      <span className='span_fr01_inner02'>Time</span>
                      <input 
                        className='input_fr01_inner02' 
                        type="text" 
                        name="time" 
                        placeholder="Enter time" 
                        value={time}
                        onChange={e => setTime(e.target.value)}
                      />                
                  </div>
                  <div className='div_fr01_inner03'>
                      <span className='span_fr01_inner03'>Vehicle Number</span>
                      <input 
                        className='input_fr01_inner03' 
                        type="text" 
                        name="vehiclenumber" 
                        placeholder="Enter Vehicle Number"  
                        value={vehicleNumber}
                        onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                      />  
                  </div>
              </div>
              <div className='div_addtraffic_modal_fr02'>
                <div className='div_addtraffic_fr02_inner01'>
                  <span className='addtraffic_span_fr02_inner01'>Vehicle Image</span>
                  <div className='addtraffic_input_container_fr02_01'>
                    <input 
                      className='addtraffic_input_fr02_inner01' 
                      type="file" 
                      name="vehicleimage" 
                      onChange={handleVehicleImageChange}
                    />
                    {vehicleImageName && <span className='file_name'>{vehicleImageName}</span>}
                  </div>
                </div>
                <div className='div_addtraffic_fr02_inner02'>
                  <span className='addtraffic_span_fr02_inner02'>Evidence Images</span>
                  <div className='addtraffic_input_container_fr02_02'>
                    <input 
                      className='addtraffic_input_fr02_inner02' 
                      type="file" 
                      name="evidenceimages" 
                      multiple
                      onChange={handleEvidenceImagesChange}
                    />
                    {evidenceImageNames.length > 0 && evidenceImageNames.map((name, index) => (
                      <span key={index} className='file_name'>{name}</span>
                    ))}
                  </div>
                </div>
                <div className='div_addtraffic_fr02_inner03'>
                  <span className='addtraffic_span_fr02_inner03'>Reason For Challan</span>
                  <div className='addtraffic_input_container_fr02_02'>
                    <input 
                      className='addtraffic_input_fr02_inner03' 
                      type="text" 
                      name="reasonforchallan" 
                      placeholder="Select a reason"  
                      value={reasonForChallan}
                      onClick={handleReasonClick}
                      readOnly 
                    />
                    {showDropdown && (
                      <div className='dropdown_menu'>
                        {options.map((option, index) => (
                          <div 
                            key={index} 
                            className='dropdown_option' 
                            onClick={() => handleOptionSelect(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='addtraffic_div_modal_fr04'>
                <div className='addtraffic_div_fr04_inner01'>
                    <button className='addtraffic_btn_fr04_inner01' onClick={handleAddTrafficDetailsSubmit}>Add</button>
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default TrafficDepartmentV2;
