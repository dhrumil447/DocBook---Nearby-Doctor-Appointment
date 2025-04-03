import React from "react";
import { Outlet, Route, Routes } from "react-router";
import App from "../App";
import Home from "./Home";
import Header from "./Header";
import Register from "./Register";
import Login from "./login";
import Doctorreg from "./Doctorreg";
import Finddoctor from "./Finddoctor";
import About from "./About";
import AdminLayout from "../Admin/AdminLayout";
import Dashboard from "../Admin/Dashboard";
import EditDoctor from "../Admin/EditDoctor";
import ViewDoctor from "../Admin/ViewDoctor";
import Doctorpanel from "../Doctor/Doctorpanel";
import ViewPatient from "../Admin/ViewPatient";
import EditPatient from "../Admin/EditPatient";

import Footer from "./Footer";
import Myprofile from "./Myprofile";


import ContactUs from "./ContactUs";
import DrSetslot from "../Doctor/DrSetslot";
import ViewAppointment from "../Doctor/ViewAppointment";
import Viewapp from "../Admin/Viewapp";
import Prescription from "../Doctor/Prescription";
import Medicalreport from "./Medicalreport";
import DoctorPatients from "../Doctor/DoctorPatients";
import DoctorDashboard from "../Doctor/Doctordashboard";
import AdminReview from "../Admin/AdminReview";
import DoctorReviews from "../Doctor/DoctorReview";
import AdminPayments from "../Admin/Payment";
// import MedicalReport from "../Doctor/medicalreport";

// import Doctor from './Doctor'

const Routing = () => {
  return (
    <>
    <Routes>
      
      <Route path="/" element={<App />}>
        <Route element={<><Header /><Outlet/><Footer/></>}>
          <Route index element={<Home />}></Route>
          <Route path="finddoctor" element={<Finddoctor />}></Route>
          <Route path="About" element={<About />}></Route>
          <Route path="profile" element={<Myprofile/>}/>
          <Route path="contact" element={<ContactUs/>}/>
          <Route path="medicalreport" element={<Medicalreport/>}/>
        </Route>
        

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="doctor/edit/:id" element={<EditDoctor />} />
          <Route path="view" element={<ViewDoctor />} />
          <Route path="patient" element={<ViewPatient/>}/>
          <Route path="patient/edit/:id" element={<EditPatient/>}/>
          <Route path="viewap" element={<Viewapp/>}/>
          <Route path="review" element={<AdminReview/>}/>
          <Route path="payment" element={<AdminPayments/>}/>
        </Route>

        <Route path="doctor" element={<Doctorpanel />}>
          <Route index element={<DoctorDashboard/>}/>
          <Route path="setslot" element={<DrSetslot/>}/>
          <Route path="dashboard" element={<DoctorDashboard/>}/>
          <Route path="ap" element={<ViewAppointment/>} />
          <Route path="prescription/:id" element={<Prescription/>}/>
          <Route path="patient" element={<DoctorPatients/>}/> 
          <Route path="review" element={<DoctorReviews/>}/>
          {/* <Route part="medicalreport" element={<MedicalReport/>}/> */}
        </Route>



        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="doctorreg" element={<Doctorreg />} />
      </Route>

      {/* <Route path="*" element={<PageNotFound/>}/> */}
    </Routes>
    
     </>
  );
};

export default Routing;
