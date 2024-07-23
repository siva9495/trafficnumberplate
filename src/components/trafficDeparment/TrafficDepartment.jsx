import React ,{useRef} from 'react';
import './TrafficDepart.css'// Import the CSS file for styling
import TableComponent from './TableComponent';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import police from '../../images/police.jpeg'
import Navbar from '../Navbar';
const TrafficDepartment = () => {
  const pdfref = useRef();

  const handlePrint = () => {
     const input=pdfref.current;
     html2canvas(input).then((canvas)=>{
      const imgData=canvas.toDataURL('image/png');
      const pdf= new jsPDF('p','mm','a4',true);
      const pdfwidth=pdf.internal.pageSize.getWidth();
      const pdfheight=pdf.internal.pageSize.getHeight();
      const imgwidth=canvas.width;
      const imgheight=canvas.height;
      const ratio=Math.min(pdfwidth/imgwidth,pdfheight/imgheight);
      const imgx=(pdfwidth-imgwidth*ratio)/2;
      const imgy=30;
      pdf.addImage(imgData,'PNG',imgx,imgy,imgwidth*ratio,imgheight*ratio);
      pdf.save('download.pdf');
    
    }
    )
  };
  return (
    
    <div className="container">
      {/* <div className='nav_bar'>
      <Navbar />
      </div> */}
      <div className="header">
          <h1 className='traffic_label'>Traffic Details</h1>
      </div>
      <div ref={pdfref}>
      <TableComponent />
      </div>
      
    </div>
  );
};

export default TrafficDepartment;
