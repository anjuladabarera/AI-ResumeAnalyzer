import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import UploadJobDescription from "./pages/uploadJobDescription.jsx";``
import UploadPDFATSScore from "./pages/uploadPDFATSScore.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/getATSScore" element={<UploadPDFATSScore />} />
      <Route path="/compareJobs" element={<UploadJobDescription />} />
    </Routes>
  );
};

export default App; 