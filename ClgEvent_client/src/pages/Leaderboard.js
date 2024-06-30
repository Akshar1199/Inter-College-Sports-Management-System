import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import CanvasJSReact from "@canvasjs/react-charts";
import "../styles/Leaderboard.css"; // Import your CSS file for animations

const { CanvasJSChart } = CanvasJSReact;

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventName, setSelectedEventName] = useState("");
  const [mostWinsCollegeId, setMostWinsCollegeId] = useState("");
  const [winner, setWinner] = useState("");
  const [showWinnerAnimation, setShowWinnerAnimation] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false); // State for pop-up visibility
  const [declarebtn, setDeclareBtn] = useState();
  const [isEnable, setIsEnable] = useState(false);
  const [EventLeaderboard, setEventLeaderboard] = useState([]);
  const [eventlead, seteventlead] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/clg/leaderboard", {
          method: "POST",
        });
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error.message);
      }
    };
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/clg/getScheduledEvents",
          {
            method: "POST",
          }
        );
        const data = await response.json();
        console.log(data);
        setEvents(data.events);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const response = await fetch("http://localhost:5000/clg/getWinner", {
          method: "GET",
        });
        const data = await response.json();
        if (data.winner) {
          setDeclareBtn(false);
          setWinner(data.winner.clg_name);
        } else {
          setDeclareBtn(true);
        }
      } catch (error) {
        console.error("Error fetching Winner:", error.message);
      }
    };
    fetchWinner();
  }, []);

  const pieChartData = leaderboard.map((clg) => ({
    y: clg.wins,
    label: clg.clg.clg_name,
  }));

  const options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "dark2",
    title: {
      text: "Wins Distribution by College",
    },
    data: [
      {
        type: "pie",
        indexLabel: "{label}: {y} points",
        startAngle: -90,
        dataPoints: pieChartData,
      },
    ],
  };

  const setWinnerCollege = async () => {};

  const handleYesClick = async () => {
    const x = leaderboard[0].clg.clg_name;
    setMostWinsCollegeId(x);
    const response = await fetch(
      `http://localhost:5000/clg/declarewinner/${mostWinsCollegeId}`,
      {
        method: "POST",
      }
    );
    let data = await response.json();
    if (data.success) {
      setWinner(leaderboard[0].clg.clg_name);
      setShowWinnerAnimation(true);
    } else {
      window.alert("Winner not Saved");
    }
    // Perform action when "Yes" is clicked
    // For example, close the pop-up and perform some action
    setDeclareBtn(false);
    setShowPopUp(false);
    // Perform your action here
  };

  const handleNoClick = () => {
    // Perform action when "No" is clicked
    // For example, close the pop-up
    setShowPopUp(false);
  };

  const handleEventChange = (event) => {
    const selectedEvent = events.find(e => e._id === event.target.value);
    if (selectedEvent) {
      setSelectedEventId(selectedEvent._id);
      setSelectedEventName(selectedEvent.event_name);
    } else {
      setSelectedEventId("");
      setSelectedEventName("");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/clg/leaderboardOfevent/${selectedEventId}`,
        {
          method : "POST"
        }
      );
      const data = await response.json();
      setEventLeaderboard(data);
      seteventlead(true);
    } catch (error) {
      console.error(
        "Error fetching leaderboard for the selected event:",
        error.message
      );
    }
  };

  let fnSetEnable = (data) => {
    setIsEnable(data);
  };

  return (
    <Layout fnSetEnable={fnSetEnable}>
      <div className="container mt-4">
        {winner && (
          <div className="text-center">
            <h2>
              The Winner of this Year is{" "}
              <span style={{ color: "blue" }}>{winner} 🏆</span>
            </h2>
          </div>
        )}
        <h1 className="mb-4">Leaderboard</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">College</th>
              <th scope="col">Total Matches</th>
              <th scope="col">Total Wins</th>
              <th scope="col">Total Loses</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((clg) => (
              <tr key={clg._id}>
                <td>{clg.clg.clg_name}</td>
                <td>{clg.total_matches}</td>
                <td>{clg.wins}</td>
                <td>{clg.loses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="container mt-4">
        <h1 className="mb-4">LeaderBoard Representation as Pie Chart</h1>
        <CanvasJSChart options={options} />
      </div>

      <div className="container mt-4">
        <h1>Select Event and Year</h1>
        <div className="form-group">
          <label htmlFor="eventSelect">Select Event:</label>
          <select
            id="eventSelect"
            className="form-control"
            onChange={handleEventChange}
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.event_name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {eventlead && (
        <div className="container mt-4">
          <h1 className="mb-4">Leaderboard of Event : {selectedEventName}</h1>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">College</th>
                <th scope="col">Total Matches</th>
                <th scope="col">Total Wins</th>
                <th scope="col">Total Loses</th>
              </tr>
            </thead>
            <tbody>
              {EventLeaderboard.map((clg) => (
                <tr key={clg._id}>
                  <td>{clg.clg.clg_name}</td>
                  <td>{clg.total_matches}</td>
                  <td>{clg.wins}</td>
                  <td>{clg.loses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {declarebtn && isEnable && (
        <div className="container mt-4">
          <button
            onClick={() => setShowPopUp(true)}
            className="btn btn-primary"
            id="sdp"
          >
            Declare the winner of This Year.
          </button>
        </div>
      )}

      {showWinnerAnimation && (
        <div className="winner-animation">
          <h2>Congratulations to the Winner!</h2>
          <p>{winner} is the winner!</p>
        </div>
      )}

      {/* Pop-up */}
      {showPopUp && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Are you sure about Declaring the winner?</h2>
            <div className="btn-group">
              <button onClick={handleYesClick} className="btn btn-primary">
                Yes
              </button>
              <button onClick={handleNoClick} className="btn btn-secondary">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Leaderboard;
