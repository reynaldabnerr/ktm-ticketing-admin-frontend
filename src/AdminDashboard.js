import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Import file CSS untuk styling

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null); // State untuk modal QR Code

  // Fungsi untuk mengambil daftar tiket dari backend
  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        "https://ktm-ticketing-backend-production.up.railway.app/tickets/all"
      );
      setTickets(response.data.tickets);
    } catch (error) {
      console.error("❌ Gagal mengambil data tiket:", error);
    }
  };

  // Ambil data tiket setiap 5 detik untuk memperbarui status "Hadir"
  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-container">
      <h2>🎟️ Daftar Peserta Event</h2>

      <a
        href="https://ktm-ticketing-backend-production.up.railway.app/tickets/export-excel"
        download
      >
        <button className="export-button">📥 Export ke Excel</button>
      </a>

      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>No HP</th>
              <th>Ticket ID</th>
              <th>QR Code</th>
              <th>Hadir</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => (
                <tr key={ticket.ticketId}>
                  <td>{index + 1}</td>
                  <td>{ticket.nama}</td>
                  <td>{ticket.email}</td>
                  <td>{ticket.noHp}</td>
                  <td>{ticket.ticketId}</td>
                  <td>
                    {ticket.qrCode ? (
                      <img
                        src={ticket.qrCode}
                        alt="QR Code"
                        className="qr-image"
                        onClick={() => setSelectedQR(ticket.qrCode)} // Klik untuk memperbesar
                      />
                    ) : (
                      "❌ Tidak Ada QR"
                    )}
                  </td>
                  <td
                    className={ticket.hadir ? "status-hadir" : "status-belum"}
                  >
                    {ticket.hadir ? "✅ Hadir" : "❌ Belum Hadir"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  ⚠️ Tidak ada tiket ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Popup untuk QR Code */}
      {selectedQR && (
        <div className="qr-modal" onClick={() => setSelectedQR(null)}>
          <div className="qr-modal-content">
            <img src={selectedQR} alt="QR Code Besar" />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
