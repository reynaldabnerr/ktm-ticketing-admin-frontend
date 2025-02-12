import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Import file CSS

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null);
  const [selectedBukti, setSelectedBukti] = useState(null);
  const [ticketIdInput, setTicketIdInput] = useState(""); // Input Ticket ID
  const [showInput, setShowInput] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prevTickets, setPrevTickets] = useState([]); // Menyimpan tiket lama
  const [highlightedTicket, setHighlightedTicket] = useState(null); // Tiket yang berubah statusnya

  useEffect(() => {
    fetchTickets(); // Jalankan sekali saat komponen dimuat
    const interval = setInterval(fetchTickets, 3000); // Jalankan setiap 3 detik
    return () => clearInterval(interval); // Bersihkan interval saat komponen di-unmount
  }, []);

  // Fungsi mengambil daftar tiket dari backend
  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        "https://ktm-ticketing-backend-production.up.railway.app/tickets/all"
      );
      const newTickets = response.data.tickets;

      // Bandingkan status tiket lama dan baru
      newTickets.forEach((newTicket) => {
        const oldTicket = prevTickets.find(
          (t) => t.ticketId === newTicket.ticketId
        );

        // Jika status berubah dari "Belum Hadir" ke "Hadir"
        if (oldTicket && !oldTicket.hadir && newTicket.hadir) {
          console.log("🔥 Tiket berubah status:", newTicket.ticketId);
          setHighlightedTicket(newTicket.ticketId);

          // Hapus efek setelah 3 detik
          setTimeout(() => setHighlightedTicket(null), 3000);
        }
      });

      setTickets(newTickets);
      setPrevTickets(newTickets); // Simpan data lama untuk perbandingan berikutnya
    } catch (error) {
      console.error("❌ Gagal mengambil data tiket:", error);
    }
  };

  // Fungsi untuk menghapus tiket berdasarkan ticketId
  const deleteTicket = async (ticketId) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus tiket ini?"
    );
    if (!confirmDelete) return;

    try {
      console.log("🗑️ Menghapus tiket:", ticketId);
      const response = await axios.delete(
        `https://ktm-ticketing-backend-production.up.railway.app/tickets/delete-ticket/${ticketId}`
      );

      alert(response.data.message);
      fetchTickets(); // Refresh daftar tiket setelah dihapus
    } catch (error) {
      console.error("❌ Gagal menghapus tiket:", error);
      alert(error.response?.data?.message || "❌ Gagal menghapus tiket!");
    }
  };

  // Fungsi untuk menandai hadir
  const markAsPresent = async (ticketId) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      console.log("📤 Mengirim ticketId ke backend:", ticketId);
      const response = await axios.post(
        "https://ktm-ticketing-backend-production.up.railway.app/tickets/check-in",
        { ticketId }
      );

      alert(response.data.message);
      setShowInput(null);
      fetchTickets(); // Refresh daftar tiket

      // 🔥 Tambahkan efek menyala ke seluruh baris
      setHighlightedTicket(ticketId);

      // 🔥 Hapus efek setelah 3 detik
      setTimeout(() => setHighlightedTicket(null), 3000);
    } catch (error) {
      console.error("❌ Gagal memperbarui status hadir:", error);
      alert(error.response?.data?.message || "❌ Gagal melakukan check-in!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-container">
      <h2>Daftar Peserta Event</h2>

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
                <tr
                  key={ticket.ticketId}
                  className={
                    highlightedTicket === ticket.ticketId
                      ? "highlight-hadir"
                      : ""
                  }
                >
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
                        <button
                          className="hadir-button"
                          onClick={() => {
                            setShowInput(ticket.ticketId);
                            setTicketIdInput(ticket.ticketId);
                          }}
                        >
                          ✔️ Tandai Hadir
                        </button>

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
                              onClick={() => markAsPresent(ticketIdInput)}
                            >
                              ✅ Konfirmasi
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    <button
                      className="delete-button"
                      onClick={() => deleteTicket(ticket.ticketId)}
                    >
                      🗑️ Hapus
                    </button>
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
        <div className="image-modal" onClick={() => setSelectedQR(null)}>
          <div className="image-modal-content">
            <img src={selectedQR} alt="QR Code Besar" />
          </div>
        </div>
      )}

      {/* Modal Popup untuk Bukti Transfer */}
      {selectedBukti && (
        <div className="image-modal" onClick={() => setSelectedBukti(null)}>
          <div className="image-modal-content">
            <img src={selectedBukti} alt="Bukti Transfer Besar" />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
