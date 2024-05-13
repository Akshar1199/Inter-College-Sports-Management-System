import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CollegeRecords.css'; // Import CSS file for styles
import Layout from './Layout';
import CanvasJSReact from '@canvasjs/react-charts';

const { CanvasJSChart } = CanvasJSReact;

export default function CollegeRecords() {
    const { collegeId } = useParams();
    const [totalWinsData, setTotalWinsData] = useState([]);
    const [college, setcollege] = useState({id : "", username: "", clg_name: "",email: "", mobile_no: "", city: "" });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`http://localhost:5000/clg/getClgDetails/${collegeId}`, {
                    method: 'POST'
                });
                const data = await res.json();
                const user = { id : data.clg._id, username: data.clg.username, clg_name: data.clg.clg_name, email: data.clg.email, mobile_no: data.clg.mobile_no, city: data.clg.city }
                setcollege(user);
            } catch (error) {
                console.error('Error While Fetching:', error.message);
            }
        };

        if (collegeId) {
            fetchUserDetails();
        }
    }, [collegeId]);

    useEffect(() => {
        const fetchTotalWinsData = async () => {
            try {
                // Fetch total wins data for the college
                const response = await fetch(
                    `http://localhost:5000/clg/getTotalWinsForCollege/${collegeId}`,
                    {
                        method: "POST",
                    }
                );
                const data = await response.json(); // Parse JSON response
                setTotalWinsData(data);
            } catch (error) {
                console.error('Error fetching total wins data:', error);
            }
        };

        fetchTotalWinsData();
    }, [collegeId]);

    // Prepare data for bar chart
    const barChartData = totalWinsData.map((event) => ({
        y: event.totalWins,
        label: event.eventName,
    }));

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "dark2",
        title: {
            text: "Total Wins for Each Event"
        },
        axisX: {
            title: "Event Name"
        },
        axisY: {
            title: "Total Wins"
        },
        data: [{
            type: "column",
            dataPoints: barChartData,
        }]
    };

    return (
        <Layout>
            <div className="college-records-container">
                <h1>{college.clg_name} College</h1>
                <CanvasJSChart options={options} />
            </div>
        </Layout>
    )
}
