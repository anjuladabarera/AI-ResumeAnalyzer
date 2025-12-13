import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/uploadPDFATSScore.css";
import { Link } from "react-router-dom";
// import "../App.css";

const UploadPDFATSScore = () => {
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
  <div className="card">
    <div className="ats-score-page">
      <div className="upload-section">
      
  
        <h1>Resume Upload & ATS Analysis</h1>


        <Link to="/" className="back-home-button">
        Back Home
      </Link>
      <br />

      <Link to="/uploadJobDescription" className="job-description-button">
        Job Description Upload
      </Link>
            <br />


      <Link to="/getATSScore" className="get-ATScore-button">
        Get ATS Score
      </Link>
            <br />



        <div className="upload-controls">
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button className="upload-now-button" onClick={handleUpload} disabled={loadingUpload}>
            {loadingUpload ? "Uploading..." : "Upload PDFFF"}
          </button>
        </div>

        {message && <p className="upload-message">{message}</p>}

        {extractedText && (
          <div className="results-grid">
            <div className="ats-card ats-card-scroll">
              <h2>Extracted Text</h2>
              <p>{extractedText}</p>
            </div>

            <div className="ats-card ats-card-scroll">
              <h2>ATS Analysis</h2>
              {loadingAI ? (
                <p className="ats-loading">Analyzing resume...</p>
              ) : (
                analysis && (
                  <>
                    {/* Score Bar */}
                    <div className="score-section">
                      <p>ATS Score: {analysis.ats_score}</p>
                      <div className="ats-score-bar">
                        <div
                          className="ats-score-fill"
                          style={{ width: `${analysis.ats_score || 0}%`, backgroundColor: getScoreColor(analysis.ats_score) }}
                        />
                      </div>
                    </div>

                    {/* Strengths */}
                    <div className="strengths-section">
                      <p>Strengths:</p>
                      {analysis.strengths.length > 0 ? (
                        <ul className="strengths-list">
                          {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      ) : (
                        <p>No strengths detected.</p>
                      )}
                    </div>

                    {/* Weaknesses */}
                    <div className="weaknesses-section">
                      <p>Weaknesses:</p>
                      {analysis.weaknesses.length > 0 ? (
                        <ul className="weaknesses-list">
                          {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      ) : (
                        <p>No weaknesses detected.</p>
                      )}
                    </div>

                    {/* Missing Keywords */}
                    <div className="missing-keywords-section">
                      <p>Missing Keywords:</p>
                      {analysis.missing_keywords.length > 0 ? (
                        <div className="flex-wrap">
                          {analysis.missing_keywords.map((k, i) => (
                            <span key={i} className="missing-keyword">{k}</span>
                          ))}
                        </div>
                      ) : (
                        <p>No missing keywords.</p>
                      )}
                    </div>

                    {/* Summary */}
                    {analysis.summary && (
                      <div className="summary-section">
                        <p>Summary:</p>
                        <p>{analysis.summary}</p>
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
  </div>
  );
  
};

export default UploadPDFATSScore;
