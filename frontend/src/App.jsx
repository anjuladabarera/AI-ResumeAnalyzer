import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/homePage.jsx";
import UploadJobDescription from "./pages/uploadJobDescription.jsx";
import UploadPDFATSScore from "./pages/uploadPDFATSScore.jsx";
import Navbar from "./components/navbar.jsx";

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
      </Routes>
    </>
  );
};

export default App;
