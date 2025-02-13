import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedQR, setSelectedQR] = useState(null);
  const [selectedBukti, setSelectedBukti] = useState(null);
  const [ticketIdInput, setTicketIdInput] = useState("");
  const [showInput, setShowInput] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [highlightedTicket, setHighlightedTicket] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isFetching, setIsFetching] = useState(false); // ✅ Cegah pemanggilan API berulang

  // 🔥 Polling data setiap 3 detik
  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 3000);
    return () => clearInterval(interval); // ✅ Bersihkan interval saat komponen di-unmount
  }, [selectedEvent]);

  // 🔥 Ambil semua tiket
  const fetchTickets = async () => {
    if (isFetching) return; // ✅ Cegah multiple API call
    setIsFetching(true);

    try {
      const response = await axios.get(
        "https://ktm-ticketing-backend-production.up.railway.app/tickets/all"
      );
      setTickets(response.data.tickets);
      filterTickets(response.data.tickets);
    } catch (error) {
      console.error("❌ Gagal mengambil data tiket:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // 🔥 Filter tiket berdasarkan event yang dipilih
  const filterTickets = (allTickets) => {
    if (!selectedEvent) {
      setFilteredTickets(allTickets);
    } else {
      const filtered = allTickets
        .map((ticket) => {
          const filteredEvents = ticket.events.filter(
            (event) => event.nama === selectedEvent
          );
          return filteredEvents.length > 0
            ? { ...ticket, events: filteredEvents }
            : null;
        })
        .filter((ticket) => ticket !== null);

      setFilteredTickets(filtered);
    }
  };

  // 🔥 Check-in tiket tanpa refresh halaman
  const markAsPresent = async (ticketId) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://ktm-ticketing-backend-production.up.railway.app/tickets/check-in",
        { ticketId }
      );

      alert(response.data.message);
      setShowInput(null);
      fetchTickets(); // ✅ Refresh daftar tiket otomatis

      // 🔥 Tambahkan efek highlight saat check-in
      setHighlightedTicket(ticketId);
      setTimeout(() => setHighlightedTicket(null), 3000);
    } catch (error) {
      console.error("❌ Gagal check-in:", error);
      alert(error.response?.data?.message || "❌ Gagal melakukan check-in!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 Hapus tiket tanpa refresh halaman
  const deleteTicket = async (eventId) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus tiket ini?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `https://ktm-ticketing-backend-production.up.railway.app/tickets/delete-ticket/${eventId}`
      );

      alert(response.data.message);
      fetchTickets(); // ✅ Refresh daftar tiket otomatis
    } catch (error) {
      console.error("❌ Gagal menghapus tiket:", error);
      alert(error.response?.data?.message || "❌ Gagal menghapus tiket!");
    }
  };

  return (
    <div className="admin-container">
      <h2>Daftar Peserta Event</h2>

      {/* 🔥 Dropdown Filter Event */}
      <select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">🔍 Semua Event</option>
        <option value="Event 1">🎟️ Event 1</option>
        <option value="Event 2">🎟️ Event 2</option>
        <option value="Event 3">🎟️ Event 3</option>
        <option value="Event 4">🎟️ Event 4</option>
      </select>

      {/* 🔥 Export Button dengan Filter */}
      <a
        href={`https://ktm-ticketing-backend-production.up.railway.app/tickets/export-excel${
          selectedEvent ? `?event=${encodeURIComponent(selectedEvent)}` : ""
        }`}
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
              <th>Event</th>
              <th>QR Code</th>
              <th>Bukti Transfer</th>
              <th>Hadir</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.flatMap((ticket, index) =>
                ticket.events.map((event, eventIndex) => (
                  <tr
                    key={`${ticket._id}-${eventIndex}`}
                    className={
                      highlightedTicket === event.ticketId
                        ? "highlight-hadir"
                        : ""
                    }
                  >
                    <td>{index + 1}</td>
                    <td>{ticket.nama}</td>
                    <td>{ticket.email}</td>
                    <td>{ticket.noHp}</td>
                    <td>{event.ticketId}</td>
                    <td>{event.nama}</td>
                    <td>
                      <img
                        src={event.qrCode}
                        alt="QR Code"
                        className="qr-image"
                        onClick={() => setSelectedQR(event.qrCode)}
                      />
                    </td>
                    <td>
                      <img
                        src={ticket.buktiTransfer}
                        alt="Bukti Transfer"
                        className="bukti-image"
                        onClick={() => setSelectedBukti(ticket.buktiTransfer)}
                      />
                    </td>
                    <td
                      className={event.hadir ? "status-hadir" : "status-belum"}
                    >
                      {event.hadir ? "✅ Hadir" : "❌ Belum Hadir"}
                    </td>
                    <td>
                      {!event.hadir && (
                        <>
                          <button
                            className="hadir-button"
                            onClick={() => {
                              setShowInput(event.ticketId);
                              setTicketIdInput(event.ticketId);
                            }}
                          >
                            ✔️ Tandai Hadir
                          </button>

                          {showInput === event.ticketId && (
                            <div>
                              <input
                                type="text"
                                placeholder="Masukkan Ticket ID"
                                value={ticketIdInput}
                                onChange={(e) =>
                                  setTicketIdInput(e.target.value)
                                }
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
                        onClick={() => deleteTicket(event._id)}
                      >
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="10" className="no-data">
                  ⚠️ Tidak ada tiket ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedQR && (
        <div className="image-modal" onClick={() => setSelectedQR(null)}>
          <div className="image-modal-content">
            <img src={selectedQR} alt="QR Code Besar" />
          </div>
        </div>
      )}

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
