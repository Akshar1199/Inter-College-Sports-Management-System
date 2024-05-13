import React from "react";
import "../styles/clgcard.css";
import {useNavigate } from "react-router-dom";

const CollegeCard = ({ college }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/Home/records/${college._id}`)
  };

  return (
    <div className="card-container1" onClick={handleClick}>
      <div className="card1">
        <div className="card-face front">
          <div className="card-body1">
            <h5 className="card-title1">{college.clg_name}</h5>
          </div>
        </div>
        <div className="card-face back">
          <div className="card-body1">
            <div className="centered-content">
              <a href="#" className="btn btn-primary" id="teams">
                Records
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;
