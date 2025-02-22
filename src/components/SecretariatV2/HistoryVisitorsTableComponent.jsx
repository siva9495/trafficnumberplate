import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import './HistoryVisitorsTableComponent.css'

const HistoryVisitorsTableComponent = () => {
    const [visitors, setVisitors] = useState([]);
    const [sortAscending, setSortAscending] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const db = getDatabase();
        const visitorsRef = ref(db, 'secretariat_visitors');
        onValue(visitorsRef, (snapshot) => {
            const data = snapshot.val();
            const visitorsList = data ? Object.values(data) : [];
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

    return (
        <div className='history_visitors_frame_dash06'>
            <div className='history_visitors_d06_inner01'>
                <div className='history_visitors_inner01_fr01'>
                    <div className='history_visitors_fr01_order'>
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
                    <div className='history_visitors_fr01_sort_download'>
                        <div className='history_visitors_sort' onClick={handleSort}>
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
                <div className='history_visitors_inner01_fr02'></div>
                <div className='history_frame_dash07_table' id='pdfTable'>
                    <table>
                        <thead >
                            <tr className='history_visitors_tr_table_head'>
                                <th className='history_table_visitors_s_no'><h4>S.No</h4></th>
                                <th className='history_table_visitors_date'><h4>Date</h4></th>
                                <th className='history_table_time'><h4>Time</h4></th>
                                <th className='history_table_visitors_name'><h4>Visitor's Name</h4></th>
                                <th className='history_table_visitor_vehicle_number'><h4>Vehicle Number</h4></th>
                                <th className='history_table_visitor_poor_id_number'><h4>Proof Id</h4></th>
                                <th className='history_table_visitor_phone_number'><h4>Phone Number</h4></th>
                                <th className='history_table_visitor_company_name'><h4>Company Name</h4></th>
                                <th className='history_table_reason_for_visit'><h4>Reason</h4></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVisitors.map((visitor, index) => (
                                <tr key={index} className='history_table_tr01'>
                                    <td className='history_table_visitors_td_s_no'>{index + 1}</td>
                                    <td className='history_table_visitors_td_sdate'>{visitor.date}</td>
                                    <td className='history_table_visitors_td_time'>{visitor.time}</td>
                                    <td className='history_table_visitors_td_name'>{visitor.name}</td>
                                    <td className='history_table_visitors_td_vehicle_number'>{visitor.vehicleNumber}</td>
                                    <td className='history_table_visitors_td_proof_id'>{visitor.proofId}</td>
                                    <td className='history_table_visitors_td_phonenumber'>{visitor.phoneNumber}</td>
                                    <td className='history_table_visitors_td_company_name'>{visitor.companyName}</td>
                                    <td className='history_table_visitors_td_reason_for_visit'>{visitor.reasonForVisit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default HistoryVisitorsTableComponent;