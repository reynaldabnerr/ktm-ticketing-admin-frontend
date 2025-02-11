import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);

  // Fetch daftar tiket dari backend
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

      {/* Tombol Export ke Excel */}
      <a
        href="https://ktm-ticketing-backend-production.up.railway.app/tickets/export-excel"
        download
      >
        <button>📥 Export ke Excel</button>
      </a>

      {/* Tabel Daftar Peserta */}
      <table border="1">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>No HP</th>
            <th>Ticket ID</th>
            <th>Hadir</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.ticketId}>
              <td>{ticket.nama}</td>
              <td>{ticket.email}</td>
              <td>{ticket.noHp}</td>
              <td>{ticket.ticketId}</td>
              <td>{ticket.hadir ? "✅ Hadir" : "❌ Belum Hadir"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
