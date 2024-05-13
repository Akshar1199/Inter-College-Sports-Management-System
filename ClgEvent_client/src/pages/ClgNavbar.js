import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import "../styles/ClgNavbar.css";
import logo from "../static/newlogo.png";
const OrganizerNavbar = ({ orgClgId, setEnable }) => {
  const navigate = useNavigate();
  const eventId = useParams();
  const [isOrgClg, setOrgClg] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [id, setId] = useState();
  const [uname, setUname] = useState();
  const [enable, setIsEnable] = useState(false); // Define enable state variable

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      setIsLogin(true);
      try {
        const decodedToken = jwtDecode(authToken);
        setId(decodedToken.user.id);
        setUname(decodedToken.user.username);

        if (id === orgClgId) {
          setOrgClg(true);
          setEnable(true);
          setIsEnable(true) // Set enable state to true
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [id, orgClgId]); // Add id and orgClgId to the dependency array

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-light sticky-top">
      <div className="container mx-1">
        <Link to="/Home" className="navbar-brand">
          <img src={logo} alt="Your Logo" className="logo-image" />
        </Link>
        <NavLink
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </NavLink>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {isLogin && isOrgClg && (
              <li className="nav-item">
                <NavLink
                  className="btn btn-link nav-link"
                  activeclassname={enable ? "active" : ""}
                  to="/Home/add-event"
                >
                  Add Event
                </NavLink>
              </li>
            )}
            {isLogin && isOrgClg && (
              <li className="nav-item">
                <NavLink
                  className="btn btn-link nav-link"
                  activeclassname="active"
                  to="/Home/schedule"
                >
                  Schedule Match
                </NavLink>
              </li>
            )}

            {isLogin && isOrgClg && (
              <li className="nav-item">
                <NavLink
                  className="btn btn-link nav-link"
                  activeclassname="active"
                  to="/Home/schedule2"
                >
                  Random Scheduling
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink
                className="btn btn-link nav-link"
                activeclassname="active"
                to="/Home/leaderboard"
              >
                Leaderboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="btn btn-link nav-link"
                activeclassname="active"
                to="/Home/matches"
              >
                Matches
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="btn btn-link nav-link"
                activeclassname="active"
                to="/Home/all-events"
              >
                All Events
              </NavLink>
            </li>
            {!isLogin ? (
              <li className="nav-item">
                <NavLink
                  className="btn btn-link nav-link"
                  activeclassname="active"
                  to="/login"
                >
                  Login
                </NavLink>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    className="btn btn-link nav-link"
                    activeclassname="active"
                    to="/Home/userProfile"
                  >
                    Update Profile
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link nav-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
                <li
                  className="nav-item mx-2 mt-1"
                  style={{
                    color: "lightsalmon",
                    fontFamily: "cursive",
                    fontSize: "20px",
                  }}
                >
                  <span>{uname}</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default OrganizerNavbar;
