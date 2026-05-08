import React from "react";
import "../assets/sass/components/_statbox.scss"

const StatBox = ({ label, value }) => {
  return (
    <div className="stat-box">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
};

export default StatBox;