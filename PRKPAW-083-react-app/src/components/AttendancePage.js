import React, { useState } from 'react';
import axios from 'axios';

const getToken = () => localStorage.getItem('token'); 

function AttendancePage() {
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // URL dasar API
  const API_URL = "http://localhost:3001/api/attendance"; 


  const handleCheckIn = async () => {
    // Reset pesan sebelumnya
    setError("");
    setMessage("");

    try {
     
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      // Panggil API Check-In menggunakan Axios POST
      const response = await axios.post(
        `${API_URL}/check-in`,
        {}, // Body request (kosong)
        config
      );

      // Tampilkan pesan sukses dari backend
      setMessage(response.data.message);
    } catch (err) {
      // Tangani error, tampilkan pesan spesifik dari backend jika ada
      setError(err.response 
        ? err.response.data.message 
        : "Check-in gagal. Server tidak merespons."
      );
    }
  };

  /**
   * Fungsi untuk mengirim permintaan Check-Out
   */
  const handleCheckOut = async () => {
    // Reset pesan sebelumnya
    setError("");
    setMessage("");
    
    try {
      // Siapkan konfigurasi header untuk otorisasi (Bearer Token)
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      // Panggil API Check-Out menggunakan Axios POST
      const response = await axios.post(
        `${API_URL}/check-out`, // Endpoint Check-Out
        {}, // Body request (kosong)
        config
      );

      // Tampilkan pesan sukses dari backend
      setMessage(response.data.message);
    } catch (err) {
      // Tangani error, tampilkan pesan spesifik dari backend jika ada
      setError(err.response 
        ? err.response.data.message 
        : "Check-out gagal. Server tidak merespons."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Lakukan Presensi
        </h2>

        {/* Tampilkan Pesan Sukses atau Error */}
        {message && <p className="text-green-600 mb-4 font-medium">{message}</p>}
        {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md
shadow-sm hover:bg-green-700 transition duration-150"
          >
            **Check-In**
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md
shadow-sm hover:bg-red-700 transition duration-150"
          >
            **Check-Out**
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;