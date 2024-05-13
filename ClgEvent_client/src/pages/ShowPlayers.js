import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Layout from './Layout';
import '../styles/showplayers.css';

function ShowPlayers() {
    const { eventId } = useParams();
    const { state } = useLocation();
    const [players, setPlayers] = useState([]);
    const [clgId, setClgId] = useState(0);
    const [clgName, setClgName] = useState(0);
    const [eventName, setEventName] = useState('');

    useEffect(() => {
        console.log(state);
        setClgId(state.clgId);
        setClgName(state.clgName);
        setEventName(state.eventName);
    }, [state]);

    useEffect(() => {
        const fetchPlayerDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/clg/getPlayers/${eventId}/${clgId}`, {
                    method: 'POST',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch player details');
                }

                const rawData = await response.json();

                if (rawData && rawData.players) {
                    setPlayers(rawData.players[0].players);
                } else {
                    console.error('Invalid server response:', rawData);
                }
            } catch (error) {
                console.error('Error fetching player details:', error.message);
            }
        };

        if (clgId) {
            fetchPlayerDetails();
        }
    }, [eventId, clgId, state]);

    return (
        <Layout>
            <div className="centered-container">
            
                <h2>Players of {clgName} in {eventName}</h2>
                {players.length > 0 ? (
                    <table className="players-table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Phone No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player, index) => (
                                <tr key={index} className="player-row">
                                    <td>{index + 1}</td>
                                    <td>{player.name}</td>
                                    <td>{player.mobileno}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-players-message">No players available</p>
                )}
            </div>
        </Layout>
    );
}

export default ShowPlayers;
