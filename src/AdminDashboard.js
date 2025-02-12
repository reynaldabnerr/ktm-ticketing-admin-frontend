import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Import CSS

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null);
  const [selectedBukti, setSelectedBukti] = useState(null);
  const [ticketIdInput, setTicketIdInput] = useState(""); // 🔥 Inputan Ticket ID
  const [showInput, setShowInput] = useState(null); // 🔥 Menentukan input yang muncul

  // Fungsi mengambil daftar tiket
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

  // Fungsi untuk menandai hadir dengan input Ticket ID
  const markAsPresent = async () => {
    if (!ticketIdInput.trim()) {
      alert("⚠️ Masukkan Ticket ID terlebih dahulu!");
      return;
    }

    try {
      console.log("📤 Mengirim ticketId ke backend:", ticketIdInput);
      const response = await axios.post(
        "https://ktm-ticketing-backend-production.up.railway.app/tickets/check-in",
        { ticketId: ticketIdInput }
      );

      alert(response.data.message); // Notifikasi sukses
      setTicketIdInput(""); // Kosongkan input setelah submit
      setShowInput(null); // Tutup input field
      fetchTickets(); // Refresh daftar tiket
    } catch (error) {
      console.error("❌ Gagal memperbarui status hadir:", error);
      alert(error.response?.data?.message || "❌ Gagal melakukan check-in!");
    }
  };

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
              <th>Bukti Transfer</th>
              <th>Hadir</th>
              <th>Action</th>
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
                        onClick={() => setSelectedQR(ticket.qrCode)}
                      />
                    ) : (
                      "❌ Tidak Ada QR"
                    )}
                  </td>
                  <td>
                    {ticket.buktiTransfer ? (
                      <img
                        src={ticket.buktiTransfer}
                        alt="Bukti Transfer"
                        className="bukti-image"
                        onClick={() => setSelectedBukti(ticket.buktiTransfer)}
                      />
                    ) : (
                      "❌ Tidak Ada Bukti"
                    )}
                  </td>
                  <td
                    className={ticket.hadir ? "status-hadir" : "status-belum"}
                  >
                    {ticket.hadir ? "✅ Hadir" : "❌ Belum Hadir"}
                  </td>
                  <td>
                    {!ticket.hadir && (
                      <>
                        {/* 🔥 Tombol untuk menampilkan input Ticket ID */}
                        <button
                          className="hadir-button"
                          onClick={() => setShowInput(ticket.ticketId)}
                        >
                          ✔️ Tandai Hadir
                        </button>

                        {/* 🔥 Input Ticket ID hanya muncul jika tombol ditekan */}
                        {showInput === ticket.ticketId && (
                          <div>
                            <input
                              type="text"
                              placeholder="Masukkan Ticket ID"
                              value={ticketIdInput}
                              onChange={(e) => setTicketIdInput(e.target.value)}
                            />
                            <button
                              className="submit-button"
                              onClick={markAsPresent}
                            >
                              ✅ Konfirmasi
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
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

      {/* Modal Popup untuk Bukti Transfer */}
      {selectedBukti && (
        <div className="bukti-modal" onClick={() => setSelectedBukti(null)}>
          <div className="bukti-modal-content">
            <img src={selectedBukti} alt="Bukti Transfer Besar" />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
