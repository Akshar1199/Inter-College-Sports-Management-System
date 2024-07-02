import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import CanvasJSReact from "@canvasjs/react-charts";
import "../styles/Leaderboard.css"; // Import your CSS file for animations
import { param } from "../../../ClgEvent_server/Routes/CollegeRoutes/PastLeaderboard";

const { CanvasJSChart } = CanvasJSReact;

const Leaderboard = (year) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventName, setSelectedEventName] = useState("");
  const [winner, setWinner] = useState("");
  const [EventLeaderboard, setEventLeaderboard] = useState([]);
  const [eventlead, seteventlead] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`http://localhost:5000/clg/Pastleaderboard/${year}`, {
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
          `http://localhost:5000/clg/getPastScheduledEvents/${year}`,
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
        const response = await fetch(`http://localhost:5000/clg/getPastWinner/${year}`, {
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


    </Layout>
  );
};

export default Leaderboard;
