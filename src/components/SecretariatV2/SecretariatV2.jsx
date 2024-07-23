import React, { useState } from 'react';
import './SecretariatV2.css';
import govtelimg from '../../images/govtelangananobg.png';
import VisitorsTableComponent from './VisitorsTableComponent';
import HistoryVisitorsTableComponent from './HistoryVisitorsTableComponent';
import { getDatabase, ref, set } from "firebase/database";
import toast, { Toaster } from 'react-hot-toast';

const SecretariatV2 = () => {
    const [showModal, setShowModal] = useState(false);
    const [view, setView] = useState('visitors'); // State to manage the current view
    const [visitorDetails, setVisitorDetails] = useState({
        name: '',
        companyName: '',
        proofId: '',
        vehicleNumber: '',
        reasonForVisit: '',
        phoneNumber: '',
        date: '',
        time: '',
        numberOfVisitors: ''
    });
    const [errors, setErrors] = useState({});

    const handleAddVisitor = () => {
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVisitorDetails({
            ...visitorDetails,
            [name]: value
        });
    };

    const validateForm = () => {
        let formErrors = {};
        if (!visitorDetails.name) formErrors.name = 'Name is required';
        if (!visitorDetails.companyName) formErrors.companyName = 'Company Name is required';
        if (!visitorDetails.proofId) formErrors.proofId = 'Aadhar/Passport Number is required';
        if (!visitorDetails.vehicleNumber) formErrors.vehicleNumber = 'Vehicle Number is required';
        if (!visitorDetails.reasonForVisit) formErrors.reasonForVisit = 'Reason For Visit is required';
        if (!visitorDetails.phoneNumber) {
            formErrors.phoneNumber = 'Phone Number is required';
        } else if (!/^\d{10}$/.test(visitorDetails.phoneNumber)) {
            formErrors.phoneNumber = 'Phone Number must be 10 digits';
        }
        if (!visitorDetails.date) formErrors.date = 'Date is required';
        if (!visitorDetails.time) formErrors.time = 'Time is required';
        if (!visitorDetails.numberOfVisitors) formErrors.numberOfVisitors = 'Number Of Visitors is required';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSaveVisitor = () => {
        if (!validateForm()) {
            toast.error('Please fill all required fields correctly.');
            return;
        }

        const db = getDatabase();
        const visitorsRef = ref(db, 'secretariat_visitors/' + visitorDetails.vehicleNumber);
        set(visitorsRef, visitorDetails).then(() => {
            setShowModal(false);
            setVisitorDetails({
                name: '',
                companyName: '',
                proofId: '',
                vehicleNumber: '',
                reasonForVisit: '',
                phoneNumber: '',
                date: '',
                time: '',
                numberOfVisitors: ''
            });
            setErrors({});
            toast.success('Visitor details saved successfully.');
        }).catch(error => {
            console.error("Error saving visitor details: ", error);
            toast.error('Error saving visitor details.');
        });
    };

    return (
        <div className='secretariatv2_department_container'>
            <Toaster />
            <div className='div_title_secretariat'>
                <span className='title_secretariat'>Secretariat Visitor's Details</span>
                <div className='div_search_addvisitors'>
                    <button className='btn_addvisitor' onClick={handleAddVisitor}>Add Visitor</button>
                </div>
            </div>
            <div className='sec_d01_inner01'>
                <div 
                    className={`inner01_cir1 ${view === 'visitors' ? 'active' : ''}`} 
                    onClick={() => setView('visitors')}
                >
                    <span>Visitor's</span>
                </div>
                <div 
                    className={`inner01_cir2 ${view === 'history' ? 'active' : ''}`} 
                    onClick={() => setView('history')}
                >
                    <span>History</span>
                </div>
            </div>
            <div className='sec_d02_table_visitors'>
                {view === 'visitors' && <VisitorsTableComponent />}
                {view === 'history' && <HistoryVisitorsTableComponent />}
            </div>
            {showModal && (
                <div className='modal_addvisitor'>
                    <div className='modal_addvisitor_content'>
                        <div className='modal_upper_buttons_addvisitor'>
                            <img className='modal_img_upper_govtel' src={govtelimg} alt="imggov" />
                            <span className="modal_close_visitor" onClick={() => setShowModal(false)}><span className='span_close_visitor'>&times;</span></span>
                        </div>
                        <div className='modal_title_visitor'>
                            <span className='modal_text_title'>Visitor Details</span>
                        </div>
                        <div className='div_modal_fr01'>
                            <div className='div_fr01_inner01'>
                                <span className='span_fr01_inner01'>Name</span>
                                <input className='input_fr01_inner01' type="text" name="name" placeholder="Enter Name" onChange={handleInputChange} value={visitorDetails.name} />
                                {errors.name && <span className="error">{errors.name}</span>}
                            </div>
                            <div className='div_fr01_inner02'>
                                <span className='span_fr01_inner02'>Company Name</span>
                                <input className='input_fr01_inner02' type="text" name="companyName" placeholder="Enter Company Name" onChange={handleInputChange} value={visitorDetails.companyName} />
                                {errors.companyName && <span className="error">{errors.companyName}</span>}
                            </div>
                            <div className='div_fr01_inner03'>
                                <span className='span_fr01_inner03'>Aadhar/Passport Number</span>
                                <input className='input_fr01_inner03' type="text" name="proofId" placeholder="Enter Aadhar/Passport Number" onChange={handleInputChange} value={visitorDetails.proofId} />
                                {errors.proofId && <span className="error">{errors.proofId}</span>}
                            </div>
                        </div>
                        <div className='div_modal_fr02'>
                            <div className='div_fr02_inner01'>
                                <span className='span_fr02_inner01'>Vehicle Number</span>
                                <input className='input_fr01_inner01' type="text" name="vehicleNumber" placeholder="Enter Vehicle Number" onChange={handleInputChange} value={visitorDetails.vehicleNumber} />
                                {errors.vehicleNumber && <span className="error">{errors.vehicleNumber}</span>}
                            </div>
                            <div className='div_fr02_inner02'>
                                <span className='span_fr02_inner02'>Reason For Visit</span>
                                <input className='input_fr01_inner02' type="text" name="reasonForVisit" placeholder="Enter Reason For Visit" onChange={handleInputChange} value={visitorDetails.reasonForVisit} />
                                {errors.reasonForVisit && <span className="error">{errors.reasonForVisit}</span>}
                            </div>
                            <div className='div_fr02_inner03'>
                                <span className='span_fr02_inner03'>Phone Number</span>
                                <input className='input_fr02_inner03' type="text" name="phoneNumber" placeholder="Enter Phone Number" onChange={handleInputChange} value={visitorDetails.phoneNumber} />
                                {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                            </div>
                        </div>
                        <div className='div_modal_fr03'>
                            <div className='div_fr03_inner01'>
                                <span className='span_fr03_inner01'>Date</span>
                                <input className='input_fr03_inner01' type="text" name="date" placeholder="DD-MM-YYYY" onChange={handleInputChange} value={visitorDetails.date} />
                                {errors.date && <span className="error">{errors.date}</span>}
                            </div>
                            <div className='div_fr03_inner02'>
                                <span className='span_fr03_inner02'>Time</span>
                                <input className='input_fr03_inner02' type="text" name="time" placeholder="Enter Time" onChange={handleInputChange} value={visitorDetails.time} />
                                {errors.time && <span className="error">{errors.time}</span>}
                            </div>
                            <div className='div_fr03_inner03'>
                                <span className='span_fr03_inner03'>Number Of Visitor's</span>
                                <input className='input_fr03_inner03' type="text" name="numberOfVisitors" placeholder="Enter Number Of Visitor's" onChange={handleInputChange} value={visitorDetails.numberOfVisitors} />
                                {errors.numberOfVisitors && <span className="error">{errors.numberOfVisitors}</span>}
                            </div>
                        </div>
                        <div className='div_modal_fr04'>
                            <div className='div_fr04_inner01'>
                                <button className='btn_fr04_inner01' onClick={handleSaveVisitor}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SecretariatV2;
