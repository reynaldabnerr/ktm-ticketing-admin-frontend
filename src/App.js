import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar"; // Import Navbar
import AdminDashboard from "./AdminDashboard"; // Import Admin Dashboard
import QRCodeScanner from "./QRCodeScanner"; // Import QR Scanner

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/scan" element={<QRCodeScanner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
