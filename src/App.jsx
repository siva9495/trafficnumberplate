
import React from 'react';
import {Routes,Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import CriminalDB from './components/CriminalDB';
import AddCriminal from './components/AddCriminal';
import TrafficDepartment from './components/trafficDeparment/TrafficDepartment';
import AddTrafficDetails from './components/trafficDeparment/AddTrafficDetails';
import Signup from './authentication/Signup';
import Secretary from './components/Secretariat/Secretary';
import Addvisitor from './components/Secretariat/Addvisitor';
import SignIn from './authentication/Signin';
import Aboutus from './components/About';
import ForCrimeDepart from './components/navComponents/ForCrimeDepart';
import ForTrafficDepart from './components/navComponents/ForTrafficDepart';
import WebApp from '../webcam_1/WebApp';
import WebStream from './testing/WebStream';
import TestStreamAccess from './testing/TestStreamAccess';
import TrafficDepartmentV2 from './components/TrafficDeparmentV2/TrafficDepartmentV2';
import SpecificCarDetails from './components/TrafficDeparmentV2/SpecificCarDetails';
import SecretariatV2 from './components/SecretariatV2/SecretariatV2';
function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes><Route path="/signup" element={<Signup/>}/>
      <Route path="/signin" element={<SignIn/>}/>

      <Route path="/" element={<Dashboard/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/MainHome" element={<Dashboard/>}/>
      <Route path="/aboutus" element={<Aboutus/>}/>
      <Route path="/criminal_dash" element={<CriminalDB/>}/>

      // v2 traffic Department
      <Route path='/trafficDepartmentv2' element={<TrafficDepartmentV2/>}/>
      <Route path="/card-details/:carNumber" element={<SpecificCarDetails />} />

      //v2 secretary Department
      <Route path="/secretaryv2" element={<SecretariatV2/>}/>


      <Route path="/trafficDepartment" element={<TrafficDepartment/>}/>
      <Route path="/criminalAdd" element={<AddCriminal/>}/>
      <Route path="/trafficDetailsAdd" element={<AddTrafficDetails/>}/>
      
      <Route path="/secretary" element={<Secretary/>}/>
      <Route path="/secretary/addvisitor" element={<Addvisitor/>}/>
      

      <Route path="/ForCrimeDepart" element={<ForCrimeDepart/>}/>
      <Route path="/ForTrafficDepart" element={<ForTrafficDepart/>}/>
      <Route path="/webcam" element={<WebApp/>}/>
      <Route path="/stream" element={<WebStream/>}/>
      <Route path="/test" element={<TestStreamAccess/>}/>
      </Routes>
    </div>
  );
}

export default App;
