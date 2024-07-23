import React from 'react';
import './ChalanPrintComponent.css'; // Ensure the correct path

const ChalanPrintComponent = React.forwardRef((props, ref) => {
  const { tableData } = props;

  return (
    <div ref={ref} className="print-container">
      {tableData.map((row, index) => (
        <table key={index} className="table-chalan">
          <thead>
            <tr>
              <th colSpan="2">Chalan Report - Serial No: {index + 1}</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Date</td><td>{row.date}</td></tr>
            <tr><td>Time</td><td>{row.time}</td></tr> {/* Changed from 'Time' to 'time' to match typical camelCase convention */}
            <tr><td>Location</td><td>{row.location}</td></tr>
            <tr><td>Number Plate</td><td>{row.numberPlate}</td></tr>
            <tr><td>Evidences</td><td>{row.evidences}</td></tr>
            <tr><td>Pending Challans</td><td>{row.pendingChallans}</td></tr>
            <tr><td>Offences</td><td>{row.reason}</td></tr>
            <tr>
              <td colSpan="2">
                <h2>Photos Captured</h2>
                <img src={row.photo1} className='image' alt={`Chalan ${index + 1}`} />
                <img src={row.photo2} className='image' alt={`Chalan ${index + 1}`} />
                <img src={row.photo3} className='image' alt={`Chalan ${index + 1}`} />
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
});

export default ChalanPrintComponent;
