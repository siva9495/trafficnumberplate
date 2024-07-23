import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue } from "firebase/database";
import ReactToPrint from 'react-to-print';
import ChalanPrintComponent from './ChalanPrintComponent';
import ChalanPrintAllComponent from './ChalanPrintAllComponent';
import './SpecificCarDetails.css';

const SpecificCarDetails = () => {
  const { carNumber } = useParams();
  const [carDetails, setCarDetails] = useState([]);
  const [evidence, setEvidence] = useState({});
  const [reasons, setReasons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPrintAllModal, setShowPrintAllModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const componentRef = useRef();
  const allComponentRef = useRef();

  useEffect(() => {
    const db = getDatabase();
    const imagesRef = ref(db, 'images');

    const unsubscribeImages = onValue(imagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const images = snapshot.val();
        const carData = Object.values(images).filter(image => image.Result === carNumber);
        if (carData.length > 0) {
          setCarDetails(carData);
          fetchEvidenceData(carData);
        } else {
          setError('No data available for this car number.');
          setLoading(false);
        }
      } else {
        setError('No data available.');
        setLoading(false);
      }
    }, (errorObject) => {
      setError(`Read failed: ${errorObject.code}`);
      setLoading(false);
    });

    const fetchEvidenceData = (carData) => {
      carData.forEach(car => {
        const carImageUniqueID = car.CarImageUniqueID;
        const evidenceRef = ref(db, `evidences/${carNumber}/${carImageUniqueID}`);
        onValue(evidenceRef, (snapshot) => {
          if (snapshot.exists()) {
            const evidenceList = [];
            snapshot.forEach(childSnapshot => {
              evidenceList.push(childSnapshot.val());
            });
            setEvidence(prevEvidence => ({
              ...prevEvidence,
              [carImageUniqueID]: evidenceList
            }));
          } else {
            setEvidence(prevEvidence => ({
              ...prevEvidence,
              [carImageUniqueID]: []
            }));
          }
        }, (errorObject) => {
          setError(`Read failed: ${errorObject.code}`);
        });

        const reasonRef = ref(db, `reason-for-challan/${carNumber}/${carImageUniqueID}`);
        onValue(reasonRef, (snapshot) => {
          if (snapshot.exists()) {
            setReasons(prevReasons => ({
              ...prevReasons,
              [carImageUniqueID]: snapshot.val().reason
            }));
          } else {
            setReasons(prevReasons => ({
              ...prevReasons,
              [carImageUniqueID]: 'N/A'
            }));
          }
        }, (errorObject) => {
          setError(`Read failed: ${errorObject.code}`);
        });
      });
      setLoading(false);
    };

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeImages();
    };
  }, [carNumber]);

  const handlePrint = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handlePrintAll = () => {
    setShowPrintAllModal(true);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredData = () => {
    return carDetails.filter(car => 
      car.Date.includes(searchTerm) || 
      (reasons[car.CarImageUniqueID] && reasons[car.CarImageUniqueID].includes(searchTerm))
    );
  };

  const getSortedData = (data) => {
    return data.sort((a, b) => {
      if (sortOrder === 'desc') {
        return new Date(b.Date) - new Date(a.Date);
      } else {
        return new Date(a.Date) - new Date(b.Date);
      }
    });
  };

  const sortedData = getSortedData(getFilteredData());

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='specific_car_details_container'>
      <div className='div_car_title'>
        <span id='text_car_title'>Traffic Vehicle Details</span>
      </div>
      <div className='frame_dash06'>
        <div className='d06_inner01'>
          <div className='inner01_fr01'>
            <div className='fr01_order'>
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
              <input type="text" placeholder="Search by Date or Reason" value={searchTerm} onChange={handleSearch} />
            </div>
            <div className='fr01_sort_download'>
              <div className='sort' onClick={handleSort}>
                <span>Sort</span>
                <i>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1.62288 9.93365C1.83116 9.72537 2.16885 9.72537 2.37713 9.93365L4.64088 12.1974L6.90462 9.93365C7.1129 9.72537 7.45059 9.72537 7.65887 9.93365C7.86715 10.1419 7.86715 10.4796 7.65887 10.6879L5.018 13.3288C4.80972 13.537 4.47203 13.537 4.26375 13.3288L1.62288 10.6879C1.4146 10.4796 1.4146 10.1419 1.62288 9.93365Z" fill="#4D4D4D"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.64083 2.51505C4.93538 2.51505 5.17416 2.75383 5.17416 3.04838L5.17416 12.9516C5.17416 13.2462 4.93538 13.485 4.64083 13.485C4.34628 13.485 4.1075 13.2462 4.1075 12.9516L4.1075 3.04838C4.1075 2.75383 4.34628 2.51505 4.64083 2.51505Z" fill="#4D4D4D"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.3771 6.06635C14.1688 6.27463 13.8311 6.27463 13.6229 6.06635L11.3591 3.80261L9.09538 6.06635C8.8871 6.27463 8.54941 6.27463 8.34113 6.06635C8.13285 5.85807 8.13285 5.52039 8.34113 5.31211L10.982 2.67124C11.1903 2.46296 11.528 2.46296 11.7362 2.67124L14.3771 5.31211C14.5854 5.52039 14.5854 5.85807 14.3771 6.06635Z" fill="#4D4D4D"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.3592 13.485C11.0646 13.485 10.8258 13.2462 10.8258 12.9516L10.8258 3.04837C10.8258 2.75382 11.0646 2.51503 11.3592 2.51503C11.6537 2.51503 11.8925 2.75382 11.8925 3.04837L11.8925 12.9516C11.8925 13.2462 11.6537 13.485 11.3592 13.485Z" fill="#4D4D4D"/>
                  </svg>
                </i>
              </div>
              <div className='download' onClick={handlePrintAll}>
                <i>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.9993 11.9414C18.371 11.9414 18.6811 12.2102 18.7435 12.5968L18.75 12.7L18.7495 16.2321C18.7495 17.5585 17.7164 18.655 16.3813 18.7448L16.2153 18.75L3.77794 18.7499C2.44615 18.7499 1.34529 17.7208 1.25525 16.391L1.25 16.2258V12.6863C1.25 12.2749 1.58596 11.9414 2.00027 11.9414C2.37194 11.9414 2.68197 12.2102 2.74442 12.5968L2.75092 12.7L2.75044 16.2321C2.75044 16.7555 3.14596 17.2013 3.65248 17.2534L3.76695 17.2599L16.2217 17.2602C16.7449 17.2602 17.1902 16.8642 17.2423 16.3577L17.2489 16.2429L17.2492 12.6863C17.2492 12.2749 17.585 11.9414 17.9993 11.9414ZM10.0121 1.25C10.3715 1.25038 10.6815 1.51921 10.744 1.90576L10.7505 2.00892L10.7512 10.8297L13.9124 7.67494C14.1433 7.44469 14.4923 7.39342 14.7961 7.54761L14.9083 7.61495L14.9846 7.68297C15.2334 7.92976 15.2646 8.33058 15.0409 8.65049L14.9652 8.73721L10.5142 13.1745L10.4327 13.2409L10.3271 13.3035L10.2368 13.3399L10.155 13.3617L10.0754 13.374L10.0133 13.3765L9.89007 13.3697L9.78548 13.3471L9.70291 13.3166L9.6007 13.2643L9.54241 13.2224L9.4569 13.1479L5.02399 8.726C4.73169 8.43447 4.73275 7.96287 5.02636 7.67264C5.28648 7.41551 5.69029 7.38633 6.01149 7.60986L6.09848 7.68534L9.25064 10.8296L9.24964 1.9952C9.24964 1.61868 9.53272 1.30251 9.90546 1.25619L10.0121 1.25Z" fill="#4D4D4D"/>
                  </svg>
                </i>
              </div>
            </div>
          </div>
          <div className='inner01_fr02'></div>
          <div className='frame_dash07_table' id='pdfTable'>
            <table>
              <thead >
                <tr className='tr_table_head'>
                  <th className='s_no'><h4>S.No</h4></th>
                  <th className='date'><h4>Date</h4></th>
                  <th className='time'><h4>Time</h4></th>
                  <th className='vehicle_number'><h4>Vehicle Number</h4></th>
                  <th className='vehicle_photos'><h4>Evidence Photos</h4></th>
                  <th className='vehicle_evidence'><h4>Reason For Challan</h4></th>
                  <th className='vehicle_print_btn'><h4>Print</h4></th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length > 0 ? (
                  sortedData.map((car, index) => (
                    <tr key={index} className='tr01'>
                      <td className='td_s_no'><h4>{index + 1}</h4></td>
                      <td className='td_sdate'>{car.Date}</td>
                      <td className='td_time'>{car.Time}</td>
                      <td className='td_vehicle_number'>{car.Result}</td>
                      <td className='th_photos'>
                        <img id='img_photo_car' src={car.Image} alt='car_image' height="100px" width="150px"></img>
                      </td>
                      <td className='td_evidence'>{reasons[car.CarImageUniqueID] || 'N/A'}</td>
                      <td className='td_print_btn'>
                        <div className='car_details_download' onClick={() => handlePrint(car)}>
                          <i>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M17.9993 11.9414C18.371 11.9414 18.6811 12.2102 18.7435 12.5968L18.75 12.7L18.7495 16.2321C18.7495 17.5585 17.7164 18.655 16.3813 18.7448L16.2153 18.75L3.77794 18.7499C2.44615 18.7499 1.34529 17.7208 1.25525 16.391L1.25 16.2258V12.6863C1.25 12.2749 1.58596 11.9414 2.00027 11.9414C2.37194 11.9414 2.68197 12.2102 2.74442 12.5968L2.75092 12.7L2.75044 16.2321C2.75044 16.7555 3.14596 17.2013 3.65248 17.2534L3.76695 17.2599L16.2217 17.2602C16.7449 17.2602 17.1902 16.8642 17.2423 16.3577L17.2489 16.2429L17.2492 12.6863C17.2492 12.2749 17.585 11.9414 17.9993 11.9414ZM10.0121 1.25C10.3715 1.25038 10.6815 1.51921 10.744 1.90576L10.7505 2.00892L10.7512 10.8297L13.9124 7.67494C14.1433 7.44469 14.4923 7.39342 14.7961 7.54761L14.9083 7.61495L14.9846 7.68297C15.2334 7.92976 15.2646 8.33058 15.0409 8.65049L14.9652 8.73721L10.5142 13.1745L10.4327 13.2409L10.3271 13.3035L10.2368 13.3399L10.155 13.3617L10.0754 13.374L10.0133 13.3765L9.89007 13.3697L9.78548 13.3471L9.70291 13.3166L9.6007 13.2643L9.54241 13.2224L9.4569 13.1479L5.02399 8.726C4.73169 8.43447 4.73275 7.96287 5.02636 7.67264C5.28648 7.41551 5.69029 7.38633 6.01149 7.60986L6.09848 7.68534L9.25064 10.8296L9.24964 1.9952C9.24964 1.61868 9.53272 1.30251 9.90546 1.25619L10.0121 1.25Z" fill="#4D4D4D"/>
                            </svg>
                          </i>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No details available for this car number.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && selectedItem && (
        <div className="modal">
          <div className="modal-content">
            <div className='modal_upper_buttons'>
              <ReactToPrint
                trigger={() => <button className='modal_print'>Print</button>}
                content={() => componentRef.current}
              />
              <span className="close" onClick={() => setShowModal(false)}><span className='span_close'>&times;</span></span>
              </div>
            <ChalanPrintComponent ref={componentRef} tableData={[selectedItem]} evidenceData={evidence} reasonsData={reasons} />
          </div>
        </div>
      )}
      {showPrintAllModal && (
        <div className="modal">
          <div className="modal-content">
            <div className='modal_upper_buttons'>
              <ReactToPrint
                trigger={() => <button className='modal_print'>Print All</button>}
                content={() => allComponentRef.current}
              />
              <span className="close" onClick={() => setShowPrintAllModal(false)}><span className='span_close'>&times;</span></span>
              </div>
            <ChalanPrintAllComponent ref={allComponentRef} carDetails={sortedData} evidenceData={evidence} reasonsData={reasons} />
          </div>
        </div>
      )}
    </div>
  );
}

export default SpecificCarDetails;
