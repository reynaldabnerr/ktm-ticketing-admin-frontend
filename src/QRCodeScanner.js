import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";

function QRCodeScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data.text);
      setError("");

      try {
        // Kirim hasil scan ke backend untuk check-in
        const response = await axios.post(
          "https://ktm-ticketing-backend-production.up.railway.app/tickets/check-in",
          { ticketId: data.text }
        );
        alert(response.data.message); // Notifikasi hasil check-in
      } catch (err) {
        setError("❌ Gagal melakukan check-in!");
        console.error("Error:", err);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("❌ Gagal mengakses kamera!");
  };

  return (
    <div>
      <h2>📷 Scan QR Code Tiket</h2>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "300px" }}
      />
      {scanResult && <p>✅ Tiket ID: {scanResult}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default QRCodeScanner;
