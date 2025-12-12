import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState(null); // Parsed JSON
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  // Warn user if page is closed while a file is selected
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

  // Send extracted text to AI
  const sendToLLM = async (text) => {
    setLoadingAI(true);
    try {
      const res = await axios.post("http://localhost:3000/api/cv/ats-score", { text });

      // Try parsing JSON
      let parsed = null;
      try {
        parsed = JSON.parse(res.data.analysis);
      } catch {
        parsed = { summary: res.data.analysis, ats_score: 0, missing_keywords: [], strengths: [], weaknesses: [] };
      }

      setAnalysis(parsed);
    } catch (error) {
      console.error("LLM Error:", error);
      setAnalysis({ summary: "AI analysis failed", ats_score: 0, missing_keywords: [], strengths: [], weaknesses: [] });
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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Upload Your Resume PDF</h2>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="border p-2 rounded w-full md:w-auto"
        />
        <button
          onClick={handleUpload}
          disabled={loadingUpload}
          className={`px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition ${
            loadingUpload ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loadingUpload ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      {message && <p className="mb-6 text-center font-medium">{message}</p>}

      {extractedText && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Extracted Text */}
          <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Extracted Text</h3>
            <div className="text-sm whitespace-pre-wrap max-h-96 overflow-auto">{extractedText}</div>
          </div>

          {/* ATS Analysis */}
          <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">ATS Analysis</h3>
            {loadingAI ? (
              <p>Analyzing resume...</p>
            ) : (
              <>
                {analysis && (
                  <>
                    {/* Score Bar */}
                    <div className="mb-4">
                      <p className="font-semibold">ATS Score: {analysis.ats_score}</p>
                      <div className="w-full h-4 bg-gray-300 rounded">
                        <div
                          className={`h-4 rounded ${getScoreColor(analysis.ats_score)}`}
                          style={{ width: `${analysis.ats_score}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Strengths */}
                    <div className="mb-4">
                      <p className="font-semibold">Strengths:</p>
                      {analysis.strengths.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      ) : <p className="text-sm text-gray-500">No strengths detected.</p>}
                    </div>

                    {/* Weaknesses */}
                    <div className="mb-4">
                      <p className="font-semibold">Weaknesses:</p>
                      {analysis.weaknesses.length > 0 ? (
                        <ul className="list-disc list-inside text-red-600">
                          {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      ) : <p className="text-sm text-gray-500">No weaknesses detected.</p>}
                    </div>

                    {/* Missing Keywords */}
                    <div className="mb-4">
                      <p className="font-semibold">Missing Keywords:</p>
                      {analysis.missing_keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {analysis.missing_keywords.map((k, i) => (
                            <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">{k}</span>
                          ))}
                        </div>
                      ) : <p className="text-sm text-gray-500">No missing keywords.</p>}
                    </div>

                    {/* Summary */}
                    {analysis.summary && (
                      <div>
                        <p className="font-semibold">Summary:</p>
                        <p className="text-sm whitespace-pre-wrap">{analysis.summary}</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
