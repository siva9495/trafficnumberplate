import React, { useState } from 'react';
import { db, storage } from '../../firebase';
import { ref as dbRef, set, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const AddTrafficDetails = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [numberPlate, setNumberPlate] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [Offences, setOffences] = useState('Driving against One Way');
  const [loading, setLoading] =useState(false)
  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !time || !numberPlate || !imageFile || !evidenceFile) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Fetch the current highest serial number
      setLoading(true)
      const serialNumberRef = dbRef(db, 'sno');
      const serialNumberSnapshot = await get(serialNumberRef);
      let currentSerialNumber = serialNumberSnapshot.exists() ? serialNumberSnapshot.val() : 0;

      // Increment the serial number
      const newSerialNumber = currentSerialNumber + 1;

      // Upload image file to Firebase Storage
      const imageStorageRef = storageRef(storage, `images/${newSerialNumber}`);
      await uploadBytes(imageStorageRef, imageFile);
      const imageUrl = await getDownloadURL(imageStorageRef);

      // Upload evidence file to Firebase Storage
      const evidenceStorageRef = storageRef(storage, `evidences/${newSerialNumber}`);
      await uploadBytes(evidenceStorageRef, evidenceFile);
      const evidenceUrl = await getDownloadURL(evidenceStorageRef);

      // Create the new entries with the incremented serial number
      const newImageEntry = {
        Date: date,
        Time: time,
        Result: numberPlate,
        Image: imageUrl,
        sno: newSerialNumber,
      };

      const newEvidenceEntry = {
        Date: date,
        Time: time,
        Image: evidenceUrl,
        sno: newSerialNumber,
        Offences:Offences,
        numberPlate:numberPlate,
      };

      // Store the data in Firebase under the new serial number
      await set(dbRef(db, `images/${newSerialNumber}`), newImageEntry);
      await set(dbRef(db, `evidences/${newSerialNumber}`), newEvidenceEntry);

      // Update the current highest serial number
      await set(serialNumberRef, newSerialNumber);

      console.log('Data added successfully.');

      // Clear form fields
      setNumberPlate('');
      setImageFile(null);
      setEvidenceFile(null);
      setLoading(false)
      toast.success('Traffic data added successfully', {
        autoClose: 2000,
        onClose: () => navigate('/trafficDepartment')
    });

    } catch (error) {
        setLoading(false)
      console.error('Error adding data: ', error);
      toast.error('Error adding criminal data', {
        position: toast.POSITION.TOP_CENTER,
    });

    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 shadow-lg">
      <div className="border shadow-lg bg-slate-300 sm:mx-auto sm:w-full sm:max-w-md py-4 rounded-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto rounded-full"
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Hyderabad_Traffic_police_logo.jpg"
            alt="crimeDepartment"
          />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Traffic Details
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                Date
              </label>
              <div className="mt-2">
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium leading-6 text-gray-900">
                Time
              </label>
              <div className="mt-2">
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="numberPlate" className="block text-sm font-medium leading-6 text-gray-900">
                Number Plate
              </label>
              <div className="mt-2">
                <input
                  id="numberPlate"
                  type="text"
                  value={numberPlate}
                  onChange={(e) => setNumberPlate(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                Image
              </label>
              <div className="mt-2">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="evidence" className="block text-sm font-medium leading-6 text-gray-900">
                Evidence
              </label>
              <div className="mt-2">
                <input
                  id="evidence"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEvidenceFile(e.target.files[0])}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="Offences" className="block text-sm font-medium leading-6 text-gray-900">
                Offences
              </label>
              <div className="mt-2">
                <select
                  id="Offences"
                  type="text"
                  value={Offences}
                  onChange={(e) => setOffences(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value='Driving against One Way'>Driving against One Way</option>
                  <option value='Over speeding of vehicle'>Over speeding of vehicle</option>
                  <option value='Driving without seat belt'>Driving without seat belts</option>
                  <option value='Signal jumping'>Signal jumping</option>
                  <option value='Over speeding'>Over speeding</option>
                  <option value='Riding without helmet'>Riding without helmet</option>
                  <option value='Riding without permit'>Riding without permit</option>
                  
                </select>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading?'Uploading...':'Submit'}
              </button>
            </div>
          </form>
        </div>
        <ToastContainer/>
      </div>
    </div>
  );
};

export default AddTrafficDetails;
