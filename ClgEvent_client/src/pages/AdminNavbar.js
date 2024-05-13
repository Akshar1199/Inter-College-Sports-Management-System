import React from 'react'
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../static/newlogo.png";

export default function AdminNavbar() {
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/login');
  };

  return (



    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container mx-1">
        <Link to="/Home" className="navbar-brand">
          <img src={logo} alt="Your Logo" className="logo-image" />
        </Link>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">

              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
              </li>
              <li className="nav-item">
                <NavLink className="btn btn-link nav-link" to='/adminhome' activeClassName='active'>Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="btn btn-link nav-link" to='/requests' activeClassName='active'>Requests</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="btn btn-link nav-link" to='/organize' activeClassName='active'>Organize</NavLink>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </div>

  )
}
