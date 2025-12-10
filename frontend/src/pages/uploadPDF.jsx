// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const UploadPDF = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState("");
//   const [extractedText, setExtractedText] = useState("");
//   const [analysis, setAnalysis] = useState("");


//   // Tab refresh / leave page warning
//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (!file) return; // Only warn if a file is selected
//       e.preventDefault();
//       e.returnValue = "";
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [file]);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Please select a PDF");

//     const formData = new FormData();
//     formData.append("pdf", file); // must match multer.single("pdf")

//     try {
//       const res = await axios.post(
//         "http://localhost:3000/api/cv/upload",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       setMessage(res.data.message);
//       setExtractedText(res.data.text); // <-- store extracted PDF text
//       setFile(null); // Clear file after upload


//     } catch (err) {
//       console.error(err);
//       setMessage("Upload failed");
//     }
//   };

//   return (
//      <div>
//       <input type="file" onChange={handleFileChange} accept="application/pdf" />
//       <button onClick={handleUpload}>Upload PDF</button>

//       <p>{message}</p>

//       {/* Display the extracted text */}
//       {extractedText && (
//         <div style={{ 
//           whiteSpace: "pre-wrap",
//           padding: "10px",
//           border: "1px solid #ccc",
//           marginTop: "10px"
//         }}>
//           <h3>Extracted Text:</h3>
//           <p>{extractedText}</p>

//           <h3>ChatGPT Text:</h3>
//           <p>{response} </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadPDF;






import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadPDF = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState(""); // ChatGPT/LLM response

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Send extracted text to LLM
  const sendToLLM = async (text) => {
    try {
      const res = await axios.post("http://localhost:3000/api/cv/ats-score", {
        text: text,
      });

      setAnalysis(res.data.analysis);
    } catch (error) {
      console.error("LLM Error:", error);
      setAnalysis("AI analysis failed.");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/cv/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(res.data.message);
      setExtractedText(res.data.text);
      setFile(null);

      // 🔥 Automatically send extracted text to LLM
      sendToLLM(res.data.text);

    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload PDF</button>

      <p>{message}</p>

      {extractedText && (
        <div
          style={{
            whiteSpace: "pre-wrap",
            padding: "10px",
            border: "1px solid #ccc",
            marginTop: "10px",
          }}
        >
          <h3>Extracted Text:</h3>
          <p>{extractedText}</p>

          <h3>ChatGPT ATS Analysis:</h3>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default UploadPDF;
