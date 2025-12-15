import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/homePage.jsx";
import UploadJobDescription from "./pages/uploadJobDescription.jsx";
import UploadPDFATSScore from "./pages/uploadPDFATSScore.jsx";
import Navbar from "./components/navbar.jsx";
import ContactUs from "./pages/contactUs.jsx";
import Footer from "./components/footer.jsx";

const App = () => {
  return (
    <>
      {/* Navbar always visible */}
      <Navbar />

      {/* Page routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/getATSScore" element={<UploadPDFATSScore />} />
        <Route path="/compareJobs" element={<UploadJobDescription />} />
        <Route path="/findAJob" element={<div>Find a Job Page - Coming Soon</div>} />
        <Route path="/skillUp" element={<div>Skill Up Page - Coming Soon</div>} />
        {/* <Route path="/aboutUs" element={<AboutUS />}/> */}
        <Route path="/contactUs" element={<ContactUs/>}/>
      </Routes>




            {/* Navbar always visible */}
      <Footer />

    </>
  );
};

export default App;
