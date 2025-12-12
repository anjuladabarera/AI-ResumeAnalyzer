import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css"; // ✅ Correct

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState(null);
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

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const sendToLLM = async (text) => {
  setLoadingAI(true);
  try {
    const res = await axios.post("http://localhost:3000/api/cv/ats-score", { text });

    let parsed = null;
    try {
      // Remove ```json ... ``` wrapper if it exists
      const cleanText = res.data.analysis
        .replace(/```json\s*/, "")
        .replace(/```/, "")
        .trim();

      parsed = JSON.parse(cleanText); // parse JSON
    } catch {
      // fallback if parsing fails
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
    if (!file) return alert("Please select a PDF");

    const formData = new FormData();
    formData.append("pdf", file);

    setLoadingUpload(true);
    setMessage("");
    setExtractedText("");
    setAnalysis(null);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/cv/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(res.data.message);
      setExtractedText(res.data.text);
      setFile(null);

      sendToLLM(res.data.text);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    } finally {
      setLoadingUpload(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Resume Upload & ATS Analysis
        </h1>

        {/* Upload Section */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="border border-gray-300 p-3 rounded w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={handleUpload}
            disabled={loadingUpload}
            className={`px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 ${
              loadingUpload ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loadingUpload ? "Uploading..." : "Upload PDF"}
          </button>
        </div>

        {message && <p className="text-center mb-6 text-gray-700 font-medium">{message}</p>}

        {/* Results Section */}
        {extractedText && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Extracted Text */}
            <div className="p-6 bg-white rounded-xl shadow-lg overflow-auto max-h-[500px]">
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">Extracted Text</h2>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{extractedText}</p>
            </div>

            {/* ATS Analysis */}
            <div className="p-6 bg-white rounded-xl shadow-lg overflow-auto max-h-[500px]">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">ATS Analysis</h2>
              {loadingAI ? (
                <p className="text-gray-500 animate-pulse">Analyzing resume...</p>
              ) : (
                analysis && (
                  <>
                    {/* Score Bar */}
                    <div className="mb-4">
                      <p className="font-semibold mb-1">ATS Score: {analysis?.ats_score}</p>
<div className="w-full h-4 bg-gray-200 rounded">
  <div
    className={`h-4 rounded ${getScoreColor(analysis?.ats_score)}`}
    style={{ width: `${analysis?.ats_score || 0}%` }}
  />
</div>
                    </div>

                    {/* Strengths */}
                    <div className="mb-4">
                      <p className="font-semibold mb-1">Strengths:</p>
                      {analysis.strengths.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700">
                          {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No strengths detected.</p>
                      )}
                    </div>

                    {/* Weaknesses */}
                    <div className="mb-4">
                      <p className="font-semibold mb-1">Weaknesses:</p>
                      {analysis.weaknesses.length > 0 ? (
                        <ul className="list-disc list-inside text-red-600">
                          {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No weaknesses detected.</p>
                      )}
                    </div>

                    {/* Missing Keywords */}
                    <div className="mb-4">
                      <p className="font-semibold mb-1">Missing Keywords:</p>
                      {analysis.missing_keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {analysis.missing_keywords.map((k, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs"
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No missing keywords.</p>
                      )}
                    </div>

                    {/* Summary */}
                    {analysis.summary && (
                      <div>
                        <p className="font-semibold mb-1">Summary:</p>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{analysis.summary}</p>
                      </div>
                    )}
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPDF;
