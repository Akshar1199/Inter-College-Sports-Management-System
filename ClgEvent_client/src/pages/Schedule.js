import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import "../styles/Schedule.css"; 

export default function Schedule() {

  const [colleges, setColleges] = useState([]);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    clg1: "",
    clg2: "",
    event: "",
    matchDate: "",
    time: "",
    winner: "",
    round: ""
  });
  const [collegesForClg1, setCollegesForClg1] = useState([]);
  const [collegesForClg2, setCollegesForClg2] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/clg/getAllCurryearEvents", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "event") {
      try {
        const response = await fetch(
          `http://localhost:5000/clg/getParticipatedclgNotScheduled/${value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setColleges(data.participatingColleges);
        setCollegesForClg1(data.participatingColleges);
        setCollegesForClg2(data.participatingColleges);

      } catch (error) {
        console.error("Error fetching events:", error.message);
      }
    } else if (name === "clg1") {
      // Filter out the selected college from the colleges for the second dropdown
      const filteredColleges = colleges.filter(
        (college) => college._id !== value
      );
      setCollegesForClg2(filteredColleges);
    } else if (name === "clg2") {
      const filteredColleges = colleges.filter(
        (college) => college._id !== value
      );
      setCollegesForClg1(filteredColleges);
    }
  };

  const handleRoundChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      round: value
    })
    
    try{
      const response = await fetch(`http://localhost:5000/clg/getClgsParticipated/${formData.event}/${value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error("Failed to fetch events");
      }
      setColleges(data.clgs);
      setCollegesForClg1(data.clgs);
      setCollegesForClg2(data.clgs);
    }catch(error){
      console.error("Error Caught while Round Change");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/clg/schedulematches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to create match");
      }
      if (response.status === 200) {
        window.alert("Match scheduled");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating match:", error.message);
    }
  };

  const currentDate = new Date().toISOString().split('T')[0];


  return (
    <Layout>
      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Name:</label>
            <select
              className="form-control"
              name="event"
              value={formData.event}
              onChange={handleInputChange}
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.event_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label for="round">Round No.</label>
            <select className="form-control" id="round" value={formData.round} onChange={handleRoundChange}>
              <option value="">Select Round</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div className="form-group">
            <label>College 1:</label>
            <select
              className="form-control"
              name="clg1"
              value={formData.clg1}
              onChange={handleInputChange}
            >
              <option value="">Select College</option>
              {collegesForClg1.map((college) => (
                <option key={college._id} value={college._id}>
                  {college.clg_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>College 2:</label>
            <select
              className="form-control"
              name="clg2"
              value={formData.clg2}
              onChange={handleInputChange}
            >
              <option value="">Select College</option>
              {collegesForClg2.map((college) => (
                <option key={college._id} value={college._id}>
                  {college.clg_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Match Date:</label>
            <input
              type="date"
              className="form-control"
              name="matchDate"
              value={formData.matchDate}
              onChange={handleInputChange}
              min={currentDate}
            />
          </div>
          <div className="form-group">
            <label>Match Time:</label>
            <input
              type="time"
              className="form-control"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}
