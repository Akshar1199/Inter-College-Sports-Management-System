import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import Layout from './Layout';
import '../styles/participatedclg.css';

function ParticipatedClg() {
    const [eventName, setEventName] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const obj = useParams();
    const eventId = obj.eventId;
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        setEventName(state.event.event_name);
    }, [state]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`http://localhost:5000/clg/getParticipatedclg/${eventId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();

                setEvents(data.participatingColleges);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error.message);
            }
        };

        fetchEvents();
    }, [eventId]);

    return (
        <Layout>
            <div className="centered-container">
                <h2>Participating Colleges in {eventName}</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : events.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>College Name</th>
                                <th>City</th>
                                <th>Players</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{event.clg_name}</td>
                                    <td>{event.city}</td>
                                    <td>
                                        <Link
                                            to='showplayers'
                                            state={{ clgId: event._id, clgName: event.clg_name, eventName: eventName }}
                                        >
                                            View Players
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div>No colleges participated yet</div>
                )}
            </div>
        </Layout>
    );
}

export default ParticipatedClg;
