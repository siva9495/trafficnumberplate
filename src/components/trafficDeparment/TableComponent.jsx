import React, { useState, useEffect, useRef } from 'react';
import './../trafficDeparment/TableComponent.css';
import { db } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import ChalanPrintComponent from './ChalanPrintComponent';
import ReactToPrint from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import plus from './plus.png';

const TableComponent = () => {
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedNumberPlate, setSelectedNumberPlate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [evidenceData, setEvidenceData] = useState({});
  const componentRef = useRef();
  const [selectedEvidenceImage, setSelectedEvidenceImage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  let numbers = 0;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const dbRefImages = ref(db, 'images');
      const dbRefEvidences = ref(db, 'evidences');

      const unsubscribeImages = onValue(dbRefImages, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setTableData(Object.values(data));
        }
      });

      const unsubscribeEvidences = onValue(dbRefEvidences, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setEvidenceData(data);
        }
      });

      return () => {
        unsubscribeImages();
        unsubscribeEvidences();
      };
    };

    fetchData();
  }, []);

  const handleFilterCriteriaChange = (e) => {
    setFilterCriteria(e.target.value);
    setFilterValue('');
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setFilterCriteria('Date');
    setFilterValue(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setFilterCriteria('Time');
    setFilterValue(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setFilterCriteria('Location');
    setFilterValue(e.target.value);
  };

  const handleNumberPlateChange = (e) => {
    setSelectedNumberPlate(e.target.value);
    setFilterCriteria('Result');
    setFilterValue(e.target.value);
  };

  const handleRemoveFilterDate = () => {
    setSelectedDate('');
    setAppliedFilters(appliedFilters.filter((filter) => filter.criteria !== 'Date'));
  };

  const handleRemoveFilterTime = () => {
    setSelectedTime('');
    setAppliedFilters(appliedFilters.filter((filter) => filter.criteria !== 'Time'));
  };

  const handleRemoveFilterLocation = () => {
    setSelectedLocation('');
    setAppliedFilters(appliedFilters.filter((filter) => filter.criteria !== 'Location'));
  };

  const handleRemoveFilterNumberPlate = () => {
    setSelectedNumberPlate('');
    setAppliedFilters(appliedFilters.filter((filter) => filter.criteria !== 'Result'));
  };

  const handleApplyFilter = () => {
    if (filterCriteria && filterValue) {
      setAppliedFilters((prevFilters) => {
        const updatedFilters = prevFilters.filter((filter) => filter.criteria !== filterCriteria);
        return [...updatedFilters, { criteria: filterCriteria, value: filterValue }];
      });
      setFilterValue('');
    }
  };

  const handleSelectEvidenceImage = (e) => {
    setSelectedEvidenceImage(e.target.value);
  };

  const handleSelectImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const filteredData = tableData.filter((row) => {
    return appliedFilters.every((filter) => {
      if (filter.criteria === 'Date' && selectedDate) {
        const rowDate = new Date(row.Date).toISOString().split('T')[0];
        const filterDate = new Date(filter.value).toISOString().split('T')[0];
        return rowDate === filterDate;
      } else if (filter.criteria === 'Time' && selectedTime) {
        return row.Time.slice(0, 5) === filter.value;
      } else if (filter.criteria === 'Location' && selectedLocation) {
        const rowLocation = row.Location ? row.Location.toLowerCase() : '';
        return rowLocation.includes(filter.value.toLowerCase());
      } else if (filter.criteria === 'Result' && selectedNumberPlate) {
        const rowNumberPlate = row.Result ? row.Result.toLowerCase() : '';
        return rowNumberPlate.includes(filter.value.toLowerCase());
      } else {
        return false;
      }
    });
  });

  const getEvidenceImages = (plateNumber, carImageUniqueId) => {
    if (evidenceData[plateNumber] && evidenceData[plateNumber][carImageUniqueId]) {
      const evidenceArray = Object.values(evidenceData[plateNumber][carImageUniqueId]);
      return evidenceArray.map((evidence) => evidence.Image);
    } else {
      return [];
    }
  };

  return (
    <div className="table-container">
      <div className="filter-container">
        <label className="sort_by">Sort By</label>
        <button className="add_details" onClick={() => navigate('/trafficDetailsAdd')}>
          Add Traffic Details
        </button>
        {selectedDate && (
          <button className="dateFilter" onClick={handleRemoveFilterDate}>
            <span>{selectedDate}</span>
            <span className="datex">X</span>
          </button>
        )}
        {selectedTime && (
          <button className="timeFilter" onClick={handleRemoveFilterTime}>
            <span>{selectedTime}</span>
            <span className="timex">X</span>
          </button>
        )}
        {selectedLocation && (
          <button className="locationFilter" onClick={handleRemoveFilterLocation}>
            <span>{selectedLocation}</span>
            <span className="locationx">X</span>
          </button>
        )}
        {selectedNumberPlate && (
          <button className="numberPlateFilter" onClick={handleRemoveFilterNumberPlate}>
            <span>{selectedNumberPlate}</span>
            <span className="numberPlateX">X</span>
          </button>
        )}
        <select value={filterCriteria} onChange={handleFilterCriteriaChange}>
          <option value="">Select Filter</option>
          <option value="Date">Date</option>
          <option value="Time">Time</option>
          <option value="Location">Location</option>
          <option value="Result">Number Plate</option>
        </select>
        {filterCriteria === 'Date' ? (
          <input type="date" value={selectedDate} onChange={handleDateChange} className='filter_by' />
        ) : filterCriteria === 'Time' ? (
          <input type="time" value={selectedTime} onChange={handleTimeChange} className='filter_by' />
        ) : filterCriteria === 'Location' ? (
          <input
            type="text"
            placeholder="Filter by Location"
            value={filterValue}
            onChange={handleLocationChange}
            className='filter_by'
          />
        ) : filterCriteria === 'Result' ? (
          <input
            type="text"
            placeholder="Filter by Number Plate"
            value={filterValue}
            onChange={handleNumberPlateChange}
            className='filter_by'
          />
        ) : null}
        <button className="applyButton" onClick={handleApplyFilter}>Apply</button>
      </div>

      <div style={{ display: 'none' }}>
        <ChalanPrintComponent ref={componentRef} tableData={filteredData} evidenceData={evidenceData} />
      </div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>S.NO.</th>
            <th>Date</th>
            <th>Time</th>
            <th>Vehicle Number</th>
            <th>Photo</th>
            <th>Evidences</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.slice().reverse().map((row, index) => {
            if (row.Result && row.Result.length === 10) {
              numbers++;
              return (
                <tr key={index}>
                  <td>{numbers}</td>
                  <td>{row.Date}</td>
                  <td>{row.Time}</td>
                  <td>{row.Result || 'N/A'}</td>
                  <td>
                    <img
                      src={row.Image}
                      alt={`Image ${index + 1}`}
                      className="table-image"
                      onClick={() => handleSelectImage(row.Image)}
                    />
                  </td>
                  <td>
                    <select
                      className="evidence-dropdown"
                      onChange={handleSelectEvidenceImage}
                    >
                      <option value="">Select Evidence</option>
                      {getEvidenceImages(row.Result, row.CarImageUniqueID).map((evidence, idx) => (
                        <option key={idx} value={evidence}>
                          Evidence {idx + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
      <div className="print">
        <ReactToPrint
          trigger={() => <button className="printButton">Print</button>}
          content={() => componentRef.current}
        />
      </div>
      {selectedEvidenceImage && (
        <div className="image-overlay">
          <button className="close-button" onClick={() => setSelectedEvidenceImage('')}>×</button>
          <img height={500} width={500} src={selectedEvidenceImage} alt="Selected Evidence" />
        </div>
      )}
      {selectedImage && (
        <div className="image-overlay">
          <button className="close-button" onClick={() => setSelectedImage('')}>×</button>
          <img height={500} width={500} src={selectedImage} alt="Selected Image" />
        </div>
      )}
    </div>
  );
};

export default TableComponent;
