import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";



const API_BASE_URL = import.meta.env.VITE_API_URL;


const UploadPDFATSScore = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState(null);
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e"; // green-500
    if (score >= 50) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  };

  const sendToLLM = async (text) => {
    setLoadingAI(true);
    try {
      const res = await axios.post( 
        `${API_BASE_URL}/api/cv/ats-score`,
         { text }

        // "http://localhost:3000/api/cv/ats-score",
        
    );
    

      let parsed;
      try {
        const cleanText = res.data.analysis
          .replace(/```json\s*/, "")
          .replace(/```/, "")
          .trim();

        parsed = JSON.parse(cleanText);
      } catch {
        parsed = {
          ats_score: 0,
          skills_match: 0,
          experience_match: 0,
          missing_keywords: [],
          strengths: [],
          weaknesses: [],
          summary: res.data.analysis,
        };
      }

      setAnalysis(parsed);
    } catch (error) {
      console.error("LLM Error:", error);
      setAnalysis({
        ats_score: 0,
        skills_match: 0,
        experience_match: 0,
        missing_keywords: [],
        strengths: [],
        weaknesses: [],
        summary: "AI analysis failed.",
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    setLoadingUpload(true);
    setMessage("");
    setExtractedText("");
    setAnalysis(null);

    try {
      const res = await axios.post(
          `${API_BASE_URL}/api/cv/upload`,
        // "http://localhost:3000/api/cv/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(res.data.message);
      setExtractedText(res.data.text);
      setFile(null);

      await sendToLLM(res.data.text);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Resume Upload & ATS Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume to get instant ATS compatibility analysis and actionable insights
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Link to="/" className="btn-secondary text-sm">
            ← Back Home
          </Link>
          <Link to="/compareJobs" className="btn-primary text-sm">
            Compare Jobs
          </Link>
        </div>

        {/* Upload Section */}
        <div className="card-modern mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="space-y-4">
            <label className="block">
              <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-300">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-200 animate-scale-in">
                <div className="flex items-center space-x-3">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                "Upload PDF"
              )}
            </button>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes("failed") ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"} animate-fade-in`}>
                <p className={`text-sm font-medium ${message.includes("failed") ? "text-red-800" : "text-green-800"}`}>
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {extractedText && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Extracted Text Card */}
            <div className="card-modern">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Extracted Text</h2>
              </div>
              <div className="max-h-96 overflow-y-auto scrollbar-modern">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{extractedText}</p>
              </div>
            </div>

            {/* ATS Analysis Card */}
            <div className="card-modern">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">ATS Analysis</h2>
              </div>

              {loadingAI ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="animate-spin h-12 w-12 text-primary-600 mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600 font-medium">Analyzing resume...</p>
                </div>
              ) : (
                analysis && (
                  <div className="space-y-6 max-h-96 overflow-y-auto scrollbar-modern">
                    {/* ATS Score */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-lg font-semibold text-gray-900">ATS Score</p>
                        <p className="text-2xl font-bold" style={{ color: getScoreColor(analysis.ats_score ?? 0) }}>
                          {analysis.ats_score ?? 0}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                        <div
                          className="h-4 rounded-full transition-all duration-1000 ease-out shadow-sm"
                          style={{
                            width: `${analysis.ats_score ?? 0}%`,
                            backgroundColor: getScoreColor(analysis.ats_score ?? 0),
                          }}
                        />
                      </div>
                    </div>

                    {/* Strengths */}
                    {analysis.strengths && analysis.strengths.length > 0 && (
                      <div>
                        <h3 className="text-md font-semibold mb-2 text-gray-900 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Strengths
                        </h3>
                        <ul className="space-y-2 bg-green-50 border border-green-200 p-4 rounded-lg">
                          {analysis.strengths.map((s, i) => (
                            <li key={i} className="flex items-start text-green-800">
                              <span className="mr-2 mt-1">✓</span>
                              <span className="text-sm">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                      <div>
                        <h3 className="text-md font-semibold mb-2 text-gray-900 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Weaknesses
                        </h3>
                        <ul className="space-y-2 bg-red-50 border border-red-200 p-4 rounded-lg">
                          {analysis.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start text-red-800">
                              <span className="mr-2 mt-1">•</span>
                              <span className="text-sm">{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Missing Keywords */}
                    {analysis.missing_keywords && analysis.missing_keywords.length > 0 && (
                      <div>
                        <h3 className="text-md font-semibold mb-3 text-gray-900">Missing Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missing_keywords.map((k, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200 hover:bg-yellow-200 transition-colors duration-200"
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    {analysis.summary && (
                      <div className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg border border-primary-200">
                        <h3 className="text-md font-semibold mb-2 text-gray-900">Summary</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{analysis.summary}</p>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPDFATSScore;










