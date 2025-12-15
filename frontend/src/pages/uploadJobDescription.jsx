import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";



const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", import.meta.env.VITE_API_URL);


const UploadJobDescription = () => {
  const getScoreColor = (score = 0) => {
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

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!file) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [file]);

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
      const res = await axios.post(
        `${API_BASE_URL}/api/cv/upload`,formData,
        // "http://localhost:3000/api/cv/upload", formData, 
      
        {
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

  const handleCompare = async () => {
    if (!jobDescription || !resumeText) {
      return alert("Both Job Description and Resume must be provided");
    }

    setLoadingAI(true);
    setAnalysis(null);

    try {
      const res = await axios.post
        // ("http://localhost:3000/api/cv/compare-jobs", 
        (`${API_BASE_URL}/api/cv/compare-jobs`,
        {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Resume vs Job Description
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume and compare it with a job description to get instant insights
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Link
            to="/"
            className="btn-secondary text-sm"
          >
            ← Back Home
          </Link>
          <Link
            to="/getATSScore"
            className="btn-primary text-sm"
          >
            Get ATS Score
          </Link>
        </div>

        {/* Job Description Card */}
        <div className="card-modern mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
          </div>
          <textarea
            rows="8"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="textarea-modern"
          />
        </div>

        {/* Resume Upload Card */}
        <div className="card-modern mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Resume (PDF)</h2>
          </div>

          <div className="space-y-4">
            <label className="block">
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-300">
                <div className="text-center">
                  <svg className="mx-auto h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF only (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </label>

            {file && (
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-200 animate-scale-in">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loadingUpload || !file}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingUpload ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Resume"
              )}
            </button>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes("failed") ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"} animate-fade-in`}>
                <p className={`text-sm font-medium ${message.includes("failed") ? "text-red-800" : "text-green-800"}`}>
                  {message}
                </p>
              </div>
            )}

            {resumeText && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-40 overflow-auto scrollbar-modern animate-fade-in">
                <p className="text-sm font-semibold mb-2 text-gray-900">Extracted Resume Text</p>
                <p className="text-sm text-gray-700 leading-relaxed">{resumeText}</p>
              </div>
            )}
          </div>
        </div>

        {/* Compare Button */}
        <button
          onClick={handleCompare}
          disabled={loadingAI || !jobDescription || !resumeText}
          className="w-full py-4 mb-10 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          {loadingAI ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            "Compare Resume & Job Description"
          )}
        </button>

        {/* Analysis Result */}
        {analysis && (
          <div className="card-modern animate-scale-in">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Comparison Result</h2>
            </div>

            {/* Match Score */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-semibold text-gray-900">Match Score</p>
                <p className="text-2xl font-bold text-primary-600">{analysis.match_score || 0}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className={`h-4 ${getScoreColor(analysis.match_score)} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                  style={{ width: `${analysis.match_score || 0}%` }}
                />
              </div>
            </div>

            {/* Strengths */}
            <Section title="Strengths" items={analysis.strengths} type="strength" />

            {/* Weaknesses */}
            <Section title="Weaknesses" items={analysis.weaknesses} type="weakness" />

            {/* Missing Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Missing Skills</h3>
              {analysis.missing_skills && analysis.missing_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 text-sm font-medium bg-red-100 text-red-700 rounded-full border border-red-200 hover:bg-red-200 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No missing skills detected.</p>
              )}
            </div>

            {/* Summary */}
            {analysis.summary && (
              <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg border border-primary-200">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Summary</h3>
                <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* Helper component for sections */
const Section = ({ title, items = [], type = "strength" }) => {
  const isStrength = type === "strength";
  const iconColor = isStrength ? "text-green-600" : "text-red-600";
  const bgColor = isStrength ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  const textColor = isStrength ? "text-green-800" : "text-red-800";

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
        <svg className={`w-5 h-5 mr-2 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isStrength ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
        {title}
      </h3>
      {items && items.length > 0 ? (
        <ul className={`space-y-2 ${bgColor} p-4 rounded-lg border`}>
          {items.map((item, i) => (
            <li key={i} className={`flex items-start ${textColor}`}>
              <span className="mr-2 mt-1">{isStrength ? "✓" : "•"}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No data available.</p>
      )}
    </div>
  );
};

export default UploadJobDescription;
