import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import '../styles/addevent.css';
import { jwtDecode } from "jwt-decode";
const AddEventForm = () => {

    const [eventData, setEventData] = useState({
        event_name: '',
        players: 0,
        venue: '',
        event_desc: '',
        event_date: '',
        reg_date: '',
        img_url: '',
        clg: '',
    });

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        try {
            const decodedToken = jwtDecode(authToken);
            eventData.clg = decodedToken.user.id;
        } catch (error) {
            console.error("Error decoding token:", error);
        }

    });

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setEventData({ ...eventData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/clg/addEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                throw new Error('Failed to add event');
            }

            window.alert('Event added successfully!');
            // formRef.current.reset();
            setEventData({
                event_name: '',
                players: 0,
                venue: '',
                event_desc: '',
                event_date: '',
                reg_date: '',
                img_url: '',
            })

        } catch (error) {
            console.error('Error adding event:', error.message);
        }
    };

    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <Layout>
            <div className="ak-bg">
                <div className="add-event-container">
                    <h2 className="add-event-heading">Add Event</h2>
                    <form onSubmit={handleSubmit} className="add-event-form">
                        <div className="form-group">
                            <div className="split-form">
                                <div className="split-form-group">
                                    <label>Event Name:</label>
                                    <input type="text" name="event_name" value={eventData.event_name} onChange={handleChange} required />
                                </div>
                                <div className="split-form-group">
                                    <label>Number of Players:</label>
                                    <input type="number" name="players" value={eventData.players} onChange={handleChange} required />
                                </div>
                                <div className="split-form-group">
                                    <label>Venue:</label>
                                    <input type="text" name="venue" value={eventData.venue} onChange={handleChange} required />
                                </div>
                                <div className="split-form-group">
                                    <label>Event Date:</label>
                                    <input type="date" name="event_date" value={eventData.event_date} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="split-form">
                                <div className="split-form-group">
                                    <label>Registration Date:</label>
                                    <input type="date" name="reg_date" value={eventData.reg_date} onChange={handleChange} required />
                                </div>
                                <div className="split-form-group">
                                    <label>Image URL:</label>
                                    <input type="text" name="img_url" value={eventData.img_url} onChange={handleChange} />
                                </div>
                                <div className="split-form-group full-width">
                                    <label>Event Description:</label>
                                    <textarea name="event_desc" value={eventData.event_desc} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="add-event-btn">Add Event</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default AddEventForm;
