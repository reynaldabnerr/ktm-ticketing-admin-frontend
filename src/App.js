import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import QRCodeScanner from "./QRCodeScanner";

function App() {
  return (
    <Router>
      <div>
        <h1>🎟️ KTM Ticketing System</h1>

        {/* Navigation Menu */}
        <nav>
          <Link to="/">🏠 Admin Dashboard</Link> |
          <Link to="/scan">📷 Scan QR</Link>
        </nav>

        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/scan" element={<QRCodeScanner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
