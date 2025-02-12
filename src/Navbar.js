import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import file CSS untuk styling navbar

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">KTM Ticketing</h1>
      <ul className="nav-links">
        <li>
          <Link to="/">🏠 Dashboard</Link>
        </li>
        <li>
          <Link to="/scan">📷 Scan QR</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
