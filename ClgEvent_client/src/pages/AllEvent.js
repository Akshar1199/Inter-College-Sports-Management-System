import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import '../styles/allevents.css';


const AllEvent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
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

    fetchEvents();
  }, []);


  return (
    <Layout>
      {/* <div className='bg'> */}
        <div className="all-events">
          <h2 className="all-events-heading">All Events</h2>
          <div className="event-grid">
            {events.map((event) => (
              <Link key={event._id} to={`/Home/all-events/${event._id}`} className="event-card-link">
                <div className="event-card" style={{ backgroundImage: `url(${event.img_url})` }}>
                  <h2>{event.event_name}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      {/* </div> */}
    </Layout>
  );
};

export default AllEvent;
