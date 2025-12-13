import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Hello</h1>

      <Link to="/" className="back-home-button">
        Back Home
      </Link>
      <Link to="/compareJobs" className="job-description-button">
        Job Description Upload
      </Link>
      <Link to="/getATSScore" className="get-ATScore-button">
        Get ATS Score
      </Link>
    </div>
  );
};

export default HomePage;
