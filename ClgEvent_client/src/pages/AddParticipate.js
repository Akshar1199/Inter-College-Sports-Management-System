import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { jwtDecode } from "jwt-decode";

const AddParticipate = () => {
  const { eventId } = useParams();
  const [players, setPlayers] = useState(0);
  const [participants, setParticipants] = useState(Array.from({ length: players }, () => ({ name: '', mobileno: '' })));
  const [userid, setUserid] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const id = decodedToken.user.id;
        setUserid(id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/clg/getEventDetails/${eventId}`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        const data = await response.json();
        setPlayers(data.players);
      } catch (error) {
        console.error('Error fetching event details:', error.message);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {

    setParticipants(Array.from({ length: players }, () => ({ name: '', mobileno: '' })));
  }, [players]);

  const handleNameChange = (e, index) => {
    const { value } = e.target;
    setParticipants((prevParticipants) => {
      const updatedParticipants = [...prevParticipants];
      updatedParticipants[index] = {
        ...updatedParticipants[index],
        name: value,
      };
      return updatedParticipants;
    });
  };

  const handlemobilenoChange = (e, index) => {
    const { value } = e.target;
    setParticipants((prevParticipants) => {
      const updatedParticipants = [...prevParticipants];
      updatedParticipants[index] = {
        ...updatedParticipants[index],
        mobileno: value,
      };
      return updatedParticipants;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/clg/addParticipants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          participants,
          userid
        }),
      });
      if (response.status === 400) {
        window.alert("Your College have already participated in this event");
        navigate('/Home/all-events')
      }
      else if (response.status === 200) {
        window.alert("Succesfully Participated!!");
        navigate('/Home/all-events')
      }

      if (!response.ok) {
        throw new Error('Failed to add participants');
      }

      // Reset the form after successful submission
      setParticipants(Array.from({ length: players }, () => ({ name: '', mobileno: '' })));
    } catch (error) {
      console.error('Error submitting participants:', error.message);
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Add Participants</h2>
        <form onSubmit={handleSubmit}>
          {participants.map((participant, index) => (
            <div key={index} className="row mb-3">
              <div className="col-md-6">
                <label htmlFor={`name${index}`} className="form-label">
                  Name{index + 1}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`name${index}`}
                  name={`name${index}`}
                  value={participant.name}
                  onChange={(e) => handleNameChange(e, index)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor={`mobileno${index}`} className="form-label">
                  mobileno{index + 1}
                </label>
                <input
                  type="mobileno"
                  className="form-control"
                  id={`mobileno${index}`}
                  name={`mobileno${index}`}
                  value={participant.mobileno}
                  onChange={(e) => handlemobilenoChange(e, index)}
                  required
                />
              </div>
            </div>
          ))}
          <button type="submit" className="btn btn-primary">
            Add Participants
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddParticipate;
