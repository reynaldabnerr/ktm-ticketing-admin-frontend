import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import file CSS untuk styling navbar

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State untuk toggle menu

  return (
    <nav className="navbar">
      <h1 className="logo">KTM Ticketing</h1>

      {/* Tombol Burger Menu (Hanya muncul di HP) */}
      <div className="burger-menu" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      {/* Navigasi Links */}
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setIsOpen(false)}>
            🏠 Dashboard
          </Link>
        </li>
        <li>
          <Link to="/scan" onClick={() => setIsOpen(false)}>
            📷 Scan QR
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
