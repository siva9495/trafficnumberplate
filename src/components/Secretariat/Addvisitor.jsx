import React, { useState, useEffect } from 'react';
import { getStorage, ref as storageRef, getDownloadURL, uploadString } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
// import { DatePicker, TimePicker } from '@mui/lab';
import DatePicker from '@mui/lab/DatePicker';
import TimePicker from '@mui/lab/TimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

export default function Addvisitor() {
    const [visitorData, setVisitorData] = useState([]);
    const navigate = useNavigate();

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

    const getHighestId = async () => {
        
        const storage = getStorage();
        const fileRef = storageRef(storage, 'Secretariat.json');
        const url = await getDownloadURL(fileRef);
        const response = await fetch(url);
        const data = await response.json();

        let highestId = 0;
        Object.keys(data).forEach(key => {
            const id = parseInt(key, 10);
            if (id > highestId) highestId = id;
        });
        return highestId;
    };

    const handleSave = async (values) => {
        try {
            const db = getStorage();
            const fileRef = storageRef(db, 'Secretariat.json');
            
            const url = await getDownloadURL(fileRef);
            const response = await fetch(url);
            const data = await response.json();

            const highestId = await getHighestId();
            const newId = (highestId + 1).toString();

            data[newId] = {              
                id: newId,
                Date: values.Date,
                Time: values.Time,
                NameofVisitor: values.NameofVisitor,
                NumberofVisitors: values.NumberofVisitors,
                CompanyName: values.CompanyName,
                AadharPassportNo: values.AadharPassportNo,
                VehicleNumber: values.VehicleNumber,
                PhoneNo: values.PhoneNo,
                Reason: values.Reason
            };
            
            const updatedJsonString = JSON.stringify(data);            
            
            await uploadString(fileRef, updatedJsonString, 'raw');
            console.log('Data created successfully!');
                
            setVisitorData([...visitorData, { id: newId, ...values }]);
            navigate('/secretary');
           
            
        } catch (error) {
            console.error("Error updating data: ", error);
        }
    };

    const validationSchema = Yup.object({
        Date: Yup.string().required('Date is required').nullable(),
        Time: Yup.string().required('Time is required').nullable(),
        NameofVisitor: Yup.string().required('Name is required'),
        NumberofVisitors: Yup.string().required('Name is required'),
        CompanyName: Yup.string().required('Company Name is required'),
        AadharPassportNo: Yup.string().required('Aadhar/Passport No is required'),
        VehicleNumber: Yup.string().required('Vehicle Number is required'),
        PhoneNo: Yup.string().matches(/^\d{10}$/, 'Phone number must be exactly 10 digits').required('Phone No is required'),
        Reason: Yup.string().required('Reason for Visit is required'),
    });

    return (
        <Container component="main" maxWidth="sm" className='pt-28'>
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Box mb={2} display="flex" justifyContent="space-between">
                    <Typography variant="h5" component="h2" gutterBottom>
                        Add New Visitor
                    </Typography>
                    <Link to="/secretary" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back</Link>
                </Box>

                <Formik
                    initialValues={{
                        Date: null,
                        Time: null,
                        NameofVisitor: '',
                        NumberofVisitors:'',
                        CompanyName: '',
                        AadharPassportNo: '',
                        VehicleNumber: '',
                        PhoneNo: '',
                        Reason: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {({ touched, errors, isSubmitting }) => (
                        <Form>
                             <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="Date"
                                    // label="Date"
                                    fullWidth
                                    type='date'
                                    variant="standard"
                                    error={touched.Date && Boolean(errors.Date)}
                                    helperText={<ErrorMessage name="Date" />}
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="Time"
                                    // label="Time"
                                    fullWidth
                                    variant="standard"
                                    type='time'
                                    error={touched.Time && Boolean(errors.Time)}
                                    helperText={<ErrorMessage name="Time" />}
                                />
                            </Box>
                             <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="NameofVisitor"
                                    label="Name of Visitor"
                                    fullWidth
                                    variant="standard"
                                    error={touched.NameofVisitor && Boolean(errors.NameofVisitor)}
                                    helperText={<ErrorMessage name="NameofVisitor" />}
                                   
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="NumberofVisitors"
                                    label="Number of Visitors"
                                    fullWidth
                                    variant="standard"
                                    error={touched.NumberofVisitors && Boolean(errors.NumberofVisitors)}
                                    helperText={<ErrorMessage name="NumberofVisitors" />}
                                   
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="CompanyName"
                                    label="Company Name"
                                    fullWidth
                                    variant="standard"
                                    error={touched.CompanyName && Boolean(errors.CompanyName)}
                                    helperText={<ErrorMessage name="CompanyName" />}
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="AadharPassportNo"
                                    label="Aadhar / Passport No"
                                    fullWidth
                                    variant="standard"
                                    error={touched.AadharPassportNo && Boolean(errors.AadharPassportNo)}
                                    helperText={<ErrorMessage name="AadharPassportNo" />}
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="VehicleNumber"
                                    label="Vehicle Number"
                                    fullWidth
                                    variant="standard"
                                    error={touched.VehicleNumber && Boolean(errors.VehicleNumber)}
                                    helperText={<ErrorMessage name="VehicleNumber" />}
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="PhoneNo"
                                    label="Phone No"
                                    fullWidth
                                    variant="standard"
                                    error={touched.PhoneNo && Boolean(errors.PhoneNo)}
                                    helperText={<ErrorMessage name="PhoneNo" />}
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    name="Reason"
                                    label="Reason for Visit"
                                    fullWidth
                                    variant="standard"
                                    error={touched.Reason && Boolean(errors.Reason)}
                                    helperText={<ErrorMessage name="Reason" />}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Save
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
}
