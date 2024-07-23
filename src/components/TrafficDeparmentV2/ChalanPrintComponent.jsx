import React, { forwardRef } from 'react';
import './ChalanPrintComponent.css';

const ChalanPrintComponent = forwardRef((props, ref) => {
  const { tableData, evidenceData, reasonsData } = props;

  const getEvidenceImages = (carImageUniqueID) => {
    if (evidenceData && evidenceData[carImageUniqueID]) {
      return evidenceData[carImageUniqueID];
    } else {
      return [];
    }
  };

  return (
    <div ref={ref} className="print-container">
      {tableData.map((row, index) => (
        <table key={index} className="table-chalan">
          <thead>
            <tr>
              <th colSpan="2">Challan Details - Serial No: {index + 1}</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Car Number</td><td>{row.Result}</td></tr>
            <tr><td>Date</td><td>{row.Date}</td></tr>
            <tr><td>Time</td><td>{row.Time}</td></tr>
            <tr><td>Reason For Challan</td><td>{reasonsData[row.CarImageUniqueID] || 'N/A'}</td></tr>
            <tr>
              <td colSpan="2">
                <h2>Evidences</h2>
                <img src={row.Image} height="100px" width="150px" className='image' alt={`Challan ${index + 1}`} />
                {getEvidenceImages(row.CarImageUniqueID).map((evidence, idx) => (
                  <img key={idx} src={evidence.Image} height="100px" width="150px" className='image' alt={`Evidence ${idx + 1}`} />
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
});

export default ChalanPrintComponent;
