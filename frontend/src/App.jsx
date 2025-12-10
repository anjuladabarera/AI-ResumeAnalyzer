import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import UploadPDF from "./pages/uploadPDF.jsx";
import UploadJobDescription from "./pages/uploadJobDescription.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload-pdf" element={<UploadPDF />} />
      <Route path="/upload-job-description" element={<UploadJobDescription />} />
    </Routes>
  );
};

export default App; 