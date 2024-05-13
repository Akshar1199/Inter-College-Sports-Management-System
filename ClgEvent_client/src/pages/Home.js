import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { jwtDecode } from "jwt-decode";
import ReactPlayer from "react-player";
import EventsHist from "./EventsHist";
import video from "../static/SDP_video.mp4";
import CollegeCard from "./CollegeCard";
import "../styles/home.css";
import win from "../static/sport4.jpg";
import logo from "../static/newlogo.png";

const CollegeList = () => {
  const [college, setCollege] = useState({});
  const [collegesList, setCollegesList] = useState([]);
  const [userid, setUserid] = useState(0);
  const [yearDifference, setYearDifference] = useState(0);
  const [yearSuffix, setYearSuffix] = useState("");

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
    const fetchColleges = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/clg/getOrganizeCollege",
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.clg) {
          setCollege(data.clg);
          localStorage.setItem("orgClgId", data.clg._id);
        } else {
          console.error("No college data found in the response:", data);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error.message);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/clg/getAllColleges", // Fetch all colleges
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setCollegesList(data);
        } else {
          console.error("Invalid college data received:", data);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error.message);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const difference = currentYear - 2022 + 1;
    setYearDifference(difference);

    const suffix = getYearSuffix(difference);
    setYearSuffix(suffix);
  }, []);

  const getYearSuffix = (num) => {
    if (num >= 11 && num <= 13) {
      return "th";
    }
    switch (num % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return (
    <Layout orgClgId={college._id}>
      <div className="video-container">
        <ReactPlayer
          className="video-player"
          url={video}
          playing
          loop
          width="100%"
          height="100%"
        />
        <div className="semi-transparent-card">
          <div className="welcome-text">
            <div className="div1">
              <div className="year">
                {yearDifference}
                {yearSuffix}
              </div>{" "}
              Inter Colleges Sports Meet
              <br />
            </div>

            <div className="div2">
              Organizer : <div className="clgname">{college.clg_name}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="sep">Event Archives</div>
      <div className="image-overlay">
        <img src={win} alt="Logo" className="hist" />
        <div className="overlay-text">
          <EventsHist />
        </div>
      </div>
      <div className="sep">Colleges Participating</div>
      <div className="college-slider">
        <div className="colleges-container">
          {collegesList.map((college) => (
            <CollegeCard key={college._id} college={college} />
          ))}
        </div>
      </div>
      <br></br>
      <br></br>
      <div className="logo-slogan-container">
        <img src={logo} alt="Your Logo" className="logo-image1" />
        <div className="slogan">
          "Campus Clashes, Sportsmanship Rises: Uniting Colleges Through
          Athletics."
        </div>
      </div>

      
      <div className="text-columns-container">
        <div className="column1">
          <h3>Inter Colleges Sports Meet</h3>
          <ul>
            <li>Official website of Inter Colleges Sports Meet</li>
            <li>Connect With Us</li>
          </ul>
          <div className="connect-icons">
            <a
              href="https://www.instagram.com/rahul_nagvadia/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram" id="insta"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/rahul-nagvadia-44121b247/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin" id="linkedin"></i>
            </a>
            <a
              href="https://wa.me/9173290586"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp" id="wp"></i>
            </a>
          </div>
        </div>
        <div className="column1">
          <h3>Quick Links </h3>
          <ul className="icon-list">
            <li>
              <a href="/home/matches">
                <i className="fas fa-futbol"></i> Matches
              </a>
            </li>
            <li>
              <a href="/home/all-events">
                <i className="fas fa-calendar-alt"></i> All Events
              </a>
            </li>
            <li>
              <a href="/home/leaderboard">
                <i className="fas fa-trophy"></i> Leaderboard
              </a>
            </li>
          </ul>
        </div>

        <div className="column1">
          <h3>About Us</h3>
          <ul className="icon-list">
            <li>Wanna Meet Us</li>
            <li>
              <i className="fas fa-map-marker-alt"></i>DDIT, College Road,
              Nadiad
            </li>
            <br></br>
            <li>Nagvadia Rahul</li>
            <li>
              <i className="fas fa-phone"></i>+91 91732 90586
            </li>
            <li>
              <i className="fas fa-envelope"></i>nagvadiarahul02@gmial.com
            </li>
            <br></br>
            <li>Akshar Parkeh</li>
            <li>
              <i className="fas fa-phone"></i>+91 90990 31199
            </li>
            <li>
              <i className="fas fa-envelope"></i>aksharparekh1199@gmail.com
            </li>
            <br></br>
            <li>Godkar Harsh</li>
            <li>
              <i className="fas fa-phone"></i>+91 96383 92046
            </li>
            <li>
              <i className="fas fa-envelope"></i>harshgodkar14@gmail.com
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default CollegeList;
