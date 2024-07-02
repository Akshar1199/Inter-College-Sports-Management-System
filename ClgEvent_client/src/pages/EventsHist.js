import React, { useState, useEffect } from "react";
import "../styles/eventhist.css"; // Import your CSS file
import {useNavigate } from "react-router-dom";

export default function EventsHist() {
  const [eventHist, setEventHist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEventHistDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/clg/getEventHistDetails`,
          {
            method: "POST",
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          setEventHist(data);
        } else if (response.status === 100) {
          setEventHist([]);
        }
      } catch (error) {
        console.error("Error fetching event details:", error.message);
      }
    };

    fetchEventHistDetails();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === eventHist.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? eventHist.length - 1 : prevIndex - 1
    );
  };

  const handleClick = () => {
    navigate(`/Home/year_records/${eventHist[currentIndex]?.year}`)
  };

  return (
    <div className="event-container">
      <div className="event-card1" onClick={handleClick}>
        <h1 className="event-year">
          Year:{" "}
          <div className="yearval">{eventHist[currentIndex]?.year}</div>
        </h1>
        <p className="college-name">
          Organizing College:{" "}
          <div className="orgval">
            {eventHist[currentIndex]?.clg?.clg_name}
          </div>
        </p>
        <p className="winner-college">
          Winner College:{" "}
          <div className="winval">
            {eventHist[currentIndex]?.winner
              ? eventHist[currentIndex]?.winner?.clg_name
              : "N/A"}
          </div>
        </p>
      </div>
      <div className="navigation-buttons">
        <button className="prev-btn" onClick={handlePrev}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <button className="next-btn" onClick={handleNext}>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
