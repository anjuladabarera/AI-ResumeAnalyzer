import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/uploadJobDescription.css";

const UploadJobDescription = () => {



    const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-400";
    return "bg-red-500";
    };

    
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  // Warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!file) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [file]);

  // Handle PDF upload
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF");

    const formData = new FormData();
    formData.append("pdf", file);

    setLoadingUpload(true);
    setMessage("");
    setResumeText("");
    setAnalysis(null);

    try {
      const res = await axios.post("http://localhost:3000/api/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Resume uploaded");
      setResumeText(res.data.text || "");
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    } finally {
      setLoadingUpload(false);
    }
  };

  // Handle comparison
  const handleCompare = async () => {
    if (!jobDescription || !resumeText) {
      return alert("Both Job Description and Resume must be provided");
    }

    setLoadingAI(true);
    setAnalysis(null);

    try {
      const res = await axios.post("http://localhost:3000/api/cv/compare-jobs", {
        jdText: jobDescription,
        text: resumeText,
      });

      setAnalysis(res.data.comparision);
    } catch (err) {
      console.error(err);
      setAnalysis({ summary: "Comparison failed" });
    } finally {
      setLoadingAI(false);
    }

  };


    

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Job Description & Resume Comparison</h1>

      {/* Navigation Links */}
      <div className="flex gap-4 mb-6">
        <Link to="/" className="back-home-button">Back Home</Link>
        <Link to="/getATSScore" className="get-ATScore-button">Get ATS Score</Link>
      </div>

      {/* Job Description */}
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows="10"
        placeholder="Paste job description here..."
        className="w-full p-3 border rounded mb-4"
      />

      {/* Resume Upload */}
      <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        disabled={loadingUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        {loadingUpload ? "Uploading..." : "Upload Resume PDF"}
      </button>

      {message && <p className="mb-4 text-gray-700">{message}</p>}
      {resumeText && (
        <div className="p-4 bg-gray-100 rounded mb-4 max-h-40 overflow-auto">
          <strong>Resume Text Extracted:</strong>
          <p>{resumeText}</p>
        </div>
      )}

      {/* Compare Button */}
      <button
        onClick={handleCompare}
        disabled={loadingAI}
        className="px-4 py-2 bg-green-600 text-white rounded mb-4"
      >
        {loadingAI ? "Analyzing..." : "Compare JD & Resume"}
      </button>

      {/* Analysis Result */}
      {analysis && (
  <div className="analysis-container">
    <h2 className="analysis-title">Comparison Result</h2>

    {/* Match Score */}
    <div className="score-card">
      <p className="score-label">Match Score:</p>
      <div className="score-bar">
        <div
          className={`score-fill ${getScoreColor(analysis.match_score)}`}
          style={{ width: `${analysis.match_score}%` }}
        ></div>
      </div>
      <p className="score-number">{analysis.match_score}%</p>
    </div>

    {/* Strengths */}
    <div className="analysis-card">
      <h3>Strengths</h3>
      {analysis.strengths.length > 0 ? (
        <ul>
          {analysis.strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      ) : (
        <p>No strengths detected.</p>
      )}
    </div>

    {/* Weaknesses */}
    <div className="analysis-card">
      <h3>Weaknesses</h3>
      {analysis.weaknesses.length > 0 ? (
        <ul>
          {analysis.weaknesses.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      ) : (
        <p>No weaknesses detected.</p>
      )}
    </div>

    {/* Missing Skills */}
    <div className="analysis-card">
      <h3>Missing Skills</h3>
      {analysis.missing_skills.length > 0 ? (
        <div className="tags-container">
          {analysis.missing_skills.map((skill, i) => (
            <span key={i} className="tag">
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p>No missing skills.</p>
      )}
    </div>

    {/* Summary */}
    {analysis.summary && (
      <div className="analysis-card">
        <h3>Summary</h3>
        <p>{analysis.summary}</p>
      </div>
    )}
  </div>
)}

    </div>
  );
};

export default UploadJobDescription;
