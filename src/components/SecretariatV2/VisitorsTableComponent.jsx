import React, { useEffect, useState } from 'react';
import './VisitorsTableComponent.css';
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import govtelimg from '../../images/govtelangananobg.png';
import toast,{ Toaster } from 'react-hot-toast';

const VisitorsTableComponent = () => {
    const [visitors, setVisitors] = useState([]);
    const [sortAscending, setSortAscending] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
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
    const [currentVisitorId, setCurrentVisitorId] = useState(null);

    useEffect(() => {
        const db = getDatabase();
        const visitorsRef = ref(db, 'secretariat_visitors');
        onValue(visitorsRef, (snapshot) => {
            const data = snapshot.val();
            const visitorsList = data ? Object.entries(data).map(([id, details]) => ({ id, ...details })) : [];
            setVisitors(visitorsList);
        });
    }, []);

    const handleSort = () => {
        const sortedVisitors = [...visitors].sort((a, b) => {
            const timeA = new Date(`${a.date} ${a.time}`).getTime();
            const timeB = new Date(`${b.date} ${b.time}`).getTime();
            return sortAscending ? timeA - timeB : timeB - timeA;
        });
        setVisitors(sortedVisitors);
        setSortAscending(!sortAscending);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredVisitors = visitors.filter(visitor => 
        visitor.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleActionsBtnEdit = (visitor) => {
        setVisitorDetails(visitor);
        setCurrentVisitorId(visitor.id);
        setShowModal(true);
    };

    const handleActionsBtnDelete = (visitorId) => {
        const db = getDatabase();
        const visitorRef = ref(db, `secretariat_visitors/${visitorId}`);
        remove(visitorRef)
            .then(() => {
                setVisitors(visitors.filter(visitor => visitor.id !== visitorId));
                toast.success('Visitor details deleted successfully');
            })
            .catch((error) => {
                console.error("Error deleting visitor:", error);
                toast.error('Failed to delete visitor details');
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVisitorDetails({ ...visitorDetails, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!visitorDetails.name) newErrors.name = "Name is required";
        if (!visitorDetails.date) newErrors.date = "Date is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const db = getDatabase();
            const visitorRef = ref(db, `secretariat_visitors/${currentVisitorId}`);
            update(visitorRef, visitorDetails)
                .then(() => {
                    setVisitors(visitors.map(visitor => 
                        visitor.id === currentVisitorId ? { id: currentVisitorId, ...visitorDetails } : visitor
                    ));
                    setShowModal(false);
                    toast.success('Visitor details updated successfully');
                })
                .catch((error) => {
                    toast.error('Failed to update visitor details');
                });
        }
    };

    return (
        <div className='visitors_frame_dash06'>
            <div className='visitors_d06_inner01'>
                <div className='visitors_inner01_fr01'>
                    <div className='visitors_fr01_order'>
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
                            value={searchTerm} 
                            onChange={handleSearch} 
                        />
                    </div>
                    <div className='visitors_fr01_sort_download'>
                        <div className='visitors_sort' onClick={handleSort}>
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
                    </div>
                </div>
                <div className='visitors_inner01_fr02'></div>
                <div className='frame_dash07_table' id='pdfTable'>
                    <table>
                        <thead >
                            <tr className='visitors_tr_table_head'>
                                <th className='table_visitors_s_no'><h4>S.No</h4></th>
                                <th className='table_visitors_date'><h4>Date</h4></th>
                                <th className='table_time'><h4>Time</h4></th>
                                <th className='table_visitors_name'><h4>Visitor's Name</h4></th>
                                <th className='table_visitor_vehicle_number'><h4>Vehicle Number</h4></th>
                                <th className='table_visitor_poor_id_number'><h4>Proof Id</h4></th>
                                <th className='table_visitor_phone_number'><h4>Phone Number</h4></th>
                                <th className='table_visitor_company_name'><h4>Company Name</h4></th>
                                <th className='table_reason_for_visit'><h4>Reason</h4></th>
                                <th className='table_no_visitors'><h4>No.of Visitors</h4></th>
                                <th className='table_actions'><h4>Actions</h4></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVisitors.map((visitor, index) => (
                                <tr key={visitor.id} className='table_tr01'>
                                    <td className='table_visitors_td_s_no'>{index + 1}</td>
                                    <td className='table_visitors_td_sdate'>{visitor.date}</td>
                                    <td className='table_visitors_td_time'>{visitor.time}</td>
                                    <td className='table_visitors_td_name'>{visitor.name}</td>
                                    <td className='table_visitors_td_vehicle_number'>{visitor.vehicleNumber}</td>
                                    <td className='table_visitors_td_proof_id'>{visitor.proofId}</td>
                                    <td className='table_visitors_td_phonenumber'>{visitor.phoneNumber}</td>
                                    <td className='table_visitors_td_company_name'>{visitor.companyName}</td>
                                    <td className='table_visitors_td_reason_for_visit'>{visitor.reasonForVisit}</td>
                                    <td className='table_visitors_td_no_visitors'>{visitor.numberOfVisitors}</td>
                                    <td className='table_visitors_td_actions'>
                                        <div className='div_table_visitors_td_actions'>
                                            <button className='actions_btn_edit' onClick={() => handleActionsBtnEdit(visitor)}>Edit</button>
                                            <button className='actions_btn_delete' onClick={() => handleActionsBtnDelete(visitor.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <div className='modal_editvisitor'>
                    <div className='modal_editvisitor_content'>
                        <div className='modal_upper_buttons_editvisitor'>
                            <img className='edit_modal_img_upper_govtel' src={govtelimg} alt="imggov" />
                            <span className="modal_close_editvisitor" onClick={() => setShowModal(false)}><span className='edit_span_close_visitor'>&times;</span></span>
                        </div>
                        <div className='edit_modal_title_visitor'>
                            <span className='edit_modal_text_title'>Edit Visitor Details</span>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className='div_edit_modal_fr01'>
                                <div className='div_edit_fr01_inner01'>
                                    <span className='edit_span_fr01_inner01'>Name</span>
                                    <input className='edit_input_fr01_inner01' type="text" name="name" placeholder="Enter Name" onChange={handleInputChange} value={visitorDetails.name} />
                                    {errors.name && <span className="error">{errors.name}</span>}
                                </div>
                                <div className='div_edit_fr01_inner02'>
                                    <span className='edit_span_fr01_inner02'>Company Name</span>
                                    <input className='edit_input_fr01_inner02' type="text" name="companyName" placeholder="Enter Company Name" onChange={handleInputChange} value={visitorDetails.companyName} />
                                    {errors.companyName && <span className="error">{errors.companyName}</span>}
                                </div>
                                <div className='div_edit_fr01_inner03'>
                                    <span className='edit_span_fr01_inner03'>Aadhar/Passport Number</span>
                                    <input className='edit_input_fr01_inner03' type="text" name="proofId" placeholder="Enter Aadhar/Passport Number" onChange={handleInputChange} value={visitorDetails.proofId} />
                                    {errors.proofId && <span className="error">{errors.proofId}</span>}
                                </div>
                            </div>
                            <div className='div_edit_modal_fr02'>
                                <div className='div_edit_fr02_inner01'>
                                    <span className='edit_span_fr02_inner01'>Vehicle Number</span>
                                    <input className='edit_input_fr01_inner01' type="text" name="vehicleNumber" placeholder="Enter Vehicle Number" onChange={handleInputChange} value={visitorDetails.vehicleNumber} />
                                    {errors.vehicleNumber && <span className="error">{errors.vehicleNumber}</span>}
                                </div>
                                <div className='div_edit_fr02_inner02'>
                                    <span className='edit_span_fr02_inner02'>Reason For Visit</span>
                                    <input className='edit_input_fr01_inner02' type="text" name="reasonForVisit" placeholder="Enter Reason For Visit" onChange={handleInputChange} value={visitorDetails.reasonForVisit} />
                                    {errors.reasonForVisit && <span className="error">{errors.reasonForVisit}</span>}
                                </div>
                                <div className='div_edit_fr02_inner03'>
                                    <span className='edit_span_fr02_inner03'>Phone Number</span>
                                    <input className='edit_input_fr02_inner03' type="text" name="phoneNumber" placeholder="Enter Phone Number" onChange={handleInputChange} value={visitorDetails.phoneNumber} />
                                    {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                                </div>
                            </div>
                            <div className='div_edit_modal_fr03'>
                                <div className='div_edit_fr03_inner01'>
                                    <span className='edit_span_fr03_inner01'>Date</span>
                                    <input className='edit_input_fr03_inner01' type="text" name="date" placeholder="DD-MM-YYYY" onChange={handleInputChange} value={visitorDetails.date} />
                                    {errors.date && <span className="error">{errors.date}</span>}
                                </div>
                                <div className='div_edit_fr03_inner02'>
                                    <span className='edit_span_fr03_inner02'>Time</span>
                                    <input className='edit_input_fr03_inner02' type="text" name="time" placeholder="Enter Time" onChange={handleInputChange} value={visitorDetails.time} />
                                    {errors.time && <span className="error">{errors.time}</span>}
                                </div>
                                <div className='div_edit_fr03_inner03'>
                                    <span className='edit_span_fr03_inner03'>Number Of Visitor's</span>
                                    <input className='edit_input_fr03_inner03' type="text" name="numberOfVisitors" placeholder="Enter Number Of Visitor's" onChange={handleInputChange} value={visitorDetails.numberOfVisitors} />
                                    {errors.numberOfVisitors && <span className="error">{errors.numberOfVisitors}</span>}
                                </div>
                            </div>
                            <div className='div_edit_modal_fr04'>
                                <div className='div_edit_fr04_inner01'>
                                    <button className='btn_edit_fr04_inner01' type="submit">Edit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitorsTableComponent;
