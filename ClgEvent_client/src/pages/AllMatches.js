import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";

export default function Matches() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/clg/getScheduledEvents', {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();

        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error.message);
      }
    };

    fetchEvents();
  }, []);
  return (
    <Layout>
      <div className="all-events-container" style={{backgroundColor: 'aliceblue',height:'100vh'}}>
        <h2 className="all-events-heading">All Events</h2>
        <div className="event-grid">
          {events.map((event) => (
            <Link key={event._id} to={`/Home/matches/scheduled/${event._id}`} className="event-card-link">
              <div className="event-card" style={{ backgroundImage: `url(${event.img_url})` }}>
                <h2>{event.event_name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
