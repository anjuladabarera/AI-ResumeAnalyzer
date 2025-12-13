import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/uploadJobDescription.css";

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
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Resume vs Job Description
        </h1>
        <p className="text-gray-500">
          Upload your resume and compare it with a job description instantly
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-8">
        <Link to="/" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
          Back Home
        </Link>
        <Link to="/getATSScore" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">
          Get ATS Score
        </Link>
      </div>

      {/* Job Description Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-lg mb-3">Job Description</h2>
        <textarea
          rows="8"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full p-3 border rounded focus:outline-none focus:ring"
        />
      </div>

      {/* Resume Upload Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="font-semibold text-lg mb-3">Upload Resume (PDF)</h2>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-3"
        />

        <button
          onClick={handleUpload}
          disabled={loadingUpload}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loadingUpload ? "Uploading..." : "Upload Resume"}
        </button>

        {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}

        {resumeText && (
          <div className="mt-4 bg-gray-100 p-4 rounded max-h-40 overflow-auto">
            <p className="text-sm font-semibold mb-1">Extracted Resume Text</p>
            <p className="text-sm text-gray-700">{resumeText}</p>
          </div>
        )}
      </div>

      {/* Compare Button */}
      <button
        onClick={handleCompare}
        disabled={loadingAI}
        className="w-full py-3 mb-10 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loadingAI ? "Analyzing..." : "Compare Resume & JD"}
      </button>

      {/* Analysis Result */}
      {analysis && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Comparison Result</h2>

          {/* Match Score */}
          <div className="mb-6">
            <p className="mb-2 font-medium">Match Score</p>
            <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
              <div
                className={`h-4 ${getScoreColor(analysis.match_score)}`}
                style={{ width: `${analysis.match_score || 0}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {analysis.match_score || 0}%
            </p>
          </div>

          {/* Strengths */}
          <Section title="Strengths" items={analysis.strengths} />

          {/* Weaknesses */}
          <Section title="Weaknesses" items={analysis.weaknesses} />

          {/* Missing Skills */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(analysis.missing_skills || []).map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          {analysis.summary && (
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-gray-700">{analysis.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* Small helper component for lists */
const Section = ({ title, items = [] }) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-2">{title}</h3>
    {items.length > 0 ? (
      <ul className="list-disc pl-5 text-gray-700">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No data available.</p>
    )}
  </div>
);



export default UploadJobDescription;
