import React, { useState, useEffect } from "react";
import QrScanner from "react-qr-scanner";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import untuk redirect

function QRCodeScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [cameraMode, setCameraMode] = useState("user"); // Default pakai webcam
  const navigate = useNavigate();

  // 🔍 Deteksi apakah perangkat adalah HP atau laptop
  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    if (isMobile) {
      setCameraMode("environment"); // Pakai kamera belakang jika di HP
    }
  }, []);

  const handleScan = async (data) => {
    if (data && scanning) {
      let scannedText = data.text || data;
      console.log("📸 Data hasil scan:", scannedText);

      if (scannedText.includes("/validate/")) {
        scannedText = scannedText.split("/validate/")[1];
        console.log("🔍 Extracted Ticket ID:", scannedText);
      }

      if (!scannedText || scannedText.trim() === "") {
        console.error("❌ Data hasil scan kosong atau tidak valid!");
        setMessage("⚠️ QR Code tidak valid, coba lagi!");
        return;
      }

      setScanning(false);
      setScanResult(scannedText);
      setMessage("🔍 Memproses check-in...");
      setIsLoading(true);

      try {
        console.log("📤 Mengirim ticketId ke backend:", scannedText);
        const response = await axios.post(
          "https://ktm-ticketing-backend-production.up.railway.app/tickets/check-in",
          { ticketId: scannedText }
        );

        console.log("✅ Respon dari backend:", response.data);
        setTimeout(() => {
          setMessage(`${response.data.message}`);
          setIsLoading(false);

          // Setelah sukses, redirect ke halaman Admin setelah 3 detik
          setTimeout(() => navigate("/"), 3000);
        }, 2000);
      } catch (err) {
        setIsLoading(false);
        console.error(
          "❌ Error dari backend:",
          err.response?.data || err.message
        );
        if (err.response && err.response.status === 400) {
          setMessage(`⚠️ ${err.response.data.message}`);
        } else {
          setMessage("❌ Gagal melakukan check-in!");
        }
      }
    }
  };

  const handleError = (err) => {
    console.error("❌ Error saat scan QR:", err);
    setMessage("❌ Gagal mengakses kamera!");
  };

  const handleRetry = () => {
    setScanning(true);
    setScanResult(null);
    setMessage("");
    setIsLoading(false);
  };

  return (
    <div>
      <h2>📷 Scan QR Code Tiket</h2>

      {scanning && (
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "300px" }}
          constraints={{
            video: { facingMode: cameraMode }, // Gunakan kamera yang sesuai dengan perangkat
          }}
        />
      )}

      {scanResult && <p>Tiket ID: {scanResult}</p>}

      {isLoading && <p style={{ color: "blue" }}>⏳ Sedang memproses...</p>}

      {message && (
        <p
          style={{
            color:
              message.includes("❌") || message.includes("⚠️")
                ? "red"
                : "green",
          }}
        >
          {message}
        </p>
      )}

      {!scanning && (
        <button
          onClick={handleRetry}
          style={{
            marginTop: "10px",
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          🔄 Coba Lagi
        </button>
      )}
    </div>
  );
}

export default QRCodeScanner;
