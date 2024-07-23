import React, { useState, useEffect } from "react";
import { db, storage } from '../../firebase'; 
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Link } from "react-router-dom";

export default function Secretary() {
    const [visitorData, setVisitorData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storage = getStorage();
                
                const fileRef = storageRef(storage, 'Secretariat.json'); // Adjust the path to your JSON file
               
                const url = await getDownloadURL(fileRef);
                           
                const response = await fetch(url);
                
                const data = await response.json();
                
                const visitorArray = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setVisitorData(visitorArray);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setVisitorData([]);
            }
        };
        fetchData();
    }, []); 

    return (
        <>
            <div className="flex flex-col p-6 gap-3 py-28">
                <div className="flex flex-col text-center">
                    <h1 className="text-2xl md:text-4xl text-blue-800 font-semibold">GOVERNMENT OF TELANGANA STATE</h1>
                    <h3 className="text-lg md:text-2xl font-semibold">Secretariat Visitor's Entry Permit</h3>
                </div>

                <div className="flex text-center md:p-4 md:flex md:justify-between">
                    <h1 className="text-lg md:text-xl font-semibold">Visitor's Details</h1>
                    <Link to="/secretary/addvisitor" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Visitor</Link>
                </div>

                <div className="flex ml-4">
                    <TableContainer component={Paper}>
                        <Table className="min-w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-600">
                            <TableHead className="text-xs text-gray-700 uppercase bg-gray-200 font-bold dark:bg-gray-700 dark:text-gray-400">
                                <TableRow>
                                    <TableCell scope="col" className="px-6 py-3">
                                        S.NO
                                    </TableCell>
                                    <TableCell scope="col" className="px-6 py-3">
                                        Date
                                    </TableCell>
                                    <TableCell scope="col" className="px-6 py-3">
                                        Time
                                    </TableCell>
                                    <TableCell scope="col" className="px-6 py-3">
                                        Name of Visitor
                                    </TableCell>
                                    <TableCell scope="col" className="px-6 py-3">
                                        No of Visitors
                                    </TableCell>
                                    <TableCell scope="col" className="px-6 py-3">
                                        Company Name
                                    </TableCell>
                                    <TableCell scope="col" className="px-6 py-3">
                                        Aadhar / Passport No.
                                    </TableCell>
                                    <TableCell scope="col" className="px-6 py-3">
                                        Vehicle Number
                                    </TableCell>
                                    <TableCell scope="col" className="px-6 py-3">
                                        Phone No
                                    </TableCell>
                                    <TableCell scope="col" className="px-6 py-3">
                                        Reason of Visit/Designation
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {visitorData.map((row) => (
                                    <TableRow key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <TableCell scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {row.id}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {row.Date}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {row.Time}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {row.NameofVisitor}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {row.NumberofVisitors}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {row.CompanyName}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {row.AadharPassportNo}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {row.VehicleNumber}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {row.PhoneNo}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {row.Reason}
                                        </TableCell>                              
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </>
    );
};
