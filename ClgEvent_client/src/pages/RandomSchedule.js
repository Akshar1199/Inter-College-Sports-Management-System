import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import "../styles/randomschedule.css";
export default function RandomSchedule() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rounds, setRounds] = useState(0);
  const [selectedRound, setSelectedRound] = useState(""); // New state for selected round
  const [participatingColleges, setParticipatingColleges] = useState([]);
  const [showColleges, setShowColleges] = useState(false);
  const [date,Setdate] = useState("");
  const [scheduledMatches, setScheduledMatches] = useState([]);
  const [formData, setFormData] = useState({
    matchDate: "",
    time: "",
  });
  const [promotedTeamMessage, setPromotedTeamMessage] = useState("");

  const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/clg/getAllCurryearEvents",
          {
            method: "POST",
          }
        );
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

  const getRounds = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/clg/getrounds/${eventId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch rounds");
      }

      const data = await response.json();
      setRounds(data.rounds);
    } catch (error) {
      console.error("Error fetching rounds:", error.message);
    }
  };

  const handleEventChange = async (event) => {
    setSelectedEvent(event);
    await getRounds(event._id);
    // Reset selected round when event changes
    setSelectedRound("");
  };

  const handleMatchDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoundChange = (e) => {
    const selectedRound = e.target.value;
    setSelectedRound(selectedRound);
  };

  const fetchParticipatingColleges = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/clg/getClgsParticipated/${selectedEvent._id}/${selectedRound}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch participating colleges");
      }

      const data = await response.json();
      setParticipatingColleges(data.clgs);
      setShowColleges(true);
    } catch (error) {
      console.error("Error fetching participating colleges:", error.message);
    }
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const scheduleMatches = async () => {
    try {
      const participatingCount = participatingColleges.length;
      if (participatingCount < 2) {
        throw new Error(
          "Not enough participating colleges to schedule matches"
        );
      }

      const matchesToSchedule = Math.floor(participatingCount / 2);
      const shuffledColleges = shuffleArray(participatingColleges);

      if(participatingCount % 2 !== 0 ){
      const oddTeam =
        participatingCount % 2 !== 0 ? shuffledColleges.pop() : null;

      const requestData = {
        eventId: selectedEvent._id,
        oddTeamId: oddTeam._id,
        rnd: selectedRound,
        match_date: formData.matchDate,
        time: formData.time,
      };

      // Call the endpoint to increment the round
      const response1 = await fetch("http://localhost:5000/clg/incrrnd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      // Check if the increment round call was successful
      if (!response1.ok) {
        throw new Error("Failed to increment round");
      }
      let message = "";
      if (oddTeam) {
        message = `Team ${oddTeam.clg_name} has been promoted!`;
      }
      setPromotedTeamMessage(message);
    }
      const scheduledMatches = [];
      for (let i = 0; i < matchesToSchedule; i++) {
        const match = {
          clg1: shuffledColleges[i * 2]._id,
          clg2: shuffledColleges[i * 2 + 1]._id,
          event: selectedEvent._id,
          matchDate: formData.matchDate,
          time: formData.time,
          round: selectedRound, // Use selectedRound instead of rounds
        };
        scheduledMatches.push(match);
      }

      const response = await fetch(
        "http://localhost:5000/clg/schedulematches2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ matches: scheduledMatches }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to schedule matches");
      }
      setShowColleges(false);
      setScheduledMatches(scheduledMatches);
      
      
    } catch (error) {
      console.error("Error scheduling matches:", error.message);
    }
  };

  function getCollegeName(collegeId) {
    // Implement a function to retrieve college name from state or fetch it from backend based on college ID
    const college = participatingColleges.find(
      (college) => college._id === collegeId
    );
    return college ? college.clg_name : "Unknown College";
  }

  return (
    <Layout>
      <div className="container mt-5">
        <form>
          <div className="form-group">
            <label>Event Name:</label>
            <select
              className="form-control"
              name="event"
              value={selectedEvent ? selectedEvent._id : ""}
              onChange={(e) =>
                handleEventChange(
                  events.find((event) => event._id === e.target.value),
                  Setdate((events.find((event) => event._id === e.target.value)).reg_date.split("T")[0])
                )
              }
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
            <label htmlFor="round">Round No.</label>
            <select
              className="form-control"
              id="round"
              value={selectedRound}
              onChange={handleRoundChange}
            >
              <option value="">Select Round</option>
              {Array.from({ length: rounds }, (_, index) => index + 1).map(
                (roundNumber, index) => (
                  <option key={index} value={roundNumber}>
                    {roundNumber}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Match Date:</label>
            <input
              type="date"
              className="form-control"
              name="matchDate"
              value={formData.matchDate}
              onChange={handleMatchDateChange}
              min={date}
            />
          </div>

          <div className="form-group">
            <label>Match Time:</label>
            <input
              type="time"
              className="form-control"
              name="time"
              value={formData.time}
              onChange={handleTimeChange}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={fetchParticipatingColleges}
          >
            Fetch Participating Colleges
          </button>
        </form>

        {showColleges && (
          <div className="mt-3 participating-colleges-container">
            <h3>Participating Colleges:</h3>
            <ul>
              {participatingColleges.map((college) => (
                <li key={college._id} className="participating-college">
                  <h4>{college.clg_name}</h4>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn-primary"
              onClick={scheduleMatches}
            >
              Schedule Matches
            </button>
          </div>
        )}

        {scheduledMatches.length > 0 && (
          <div className="mt-3 scheduled-matches-container">
            <h3>Scheduled Matches:</h3>
            <ul>
              {scheduledMatches.map((match, index) => (
                <li key={index} className="scheduled-match">
                  <h4>
                    Match between {getCollegeName(match.clg1)} and{" "}
                    {getCollegeName(match.clg2)}
                  </h4>
                  <div className="scheduled-match-details">
                    <span>Date: {match.matchDate}</span>
                    <span>Time: {match.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {promotedTeamMessage && (
          <div className="promoted-team-message">
            <p>{promotedTeamMessage}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
