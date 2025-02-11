import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://ktm-ticketing-backend-production.up.railway.app/tickets/all"
      )
      .then((response) => {
        setTickets(response.data.tickets);
      })
      .catch((error) => {
        console.error("Gagal mengambil data tiket:", error);
      });
  }, []);

  return (
    <div>
      <h2>🎟️ Daftar Peserta Event</h2>

      <a
        href="https://ktm-ticketing-backend-production.up.railway.app/tickets/export-excel"
        download
      >
        <button>📥 Export ke Excel</button>
      </a>

      <table border="1">
        <thead>
          <tr>
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
            tickets.map((ticket) => (
              <tr key={ticket.ticketId}>
                <td>{ticket.nama}</td>
                <td>{ticket.email}</td>
                <td>{ticket.noHp}</td>
                <td>{ticket.ticketId}</td>
                <td>
                  {ticket.qrCode ? (
                    <img src={ticket.qrCode} alt="QR Code" width="100" />
                  ) : (
                    "❌ Tidak Ada QR"
                  )}
                </td>
                <td>{ticket.hadir ? "✅ Hadir" : "❌ Belum Hadir"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">⚠️ Tidak ada tiket ditemukan</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
