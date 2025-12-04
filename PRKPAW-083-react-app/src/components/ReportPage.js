import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const API_URL = "http://localhost:3001/api/reports/daily"; 

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  /**
   * Mengambil data laporan presensi dari API
   * @param {string} nameQuery - Nilai pencarian nama
   * @param {string} start - Tanggal mulai (YYYY-MM-DD)
   * @param {string} end - Tanggal akhir (YYYY-MM-DD)
   */
  const fetchReports = async (nameQuery = "", start = "", end = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Peringatan dan navigasi jika token tidak ada (belum login)
      console.warn("Token tidak ditemukan, mengarahkan ke halaman login.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);
    setReports([]);

    // 1. Membangun Query Parameter untuk API
    let queryParams = [];
    if (nameQuery) {
      queryParams.push(`nama=${nameQuery}`);
    }
    if (start) {
      queryParams.push(`startDate=${start}`);
    }
    if (end) {
      queryParams.push(`endDate=${end}`);
    }

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    const finalUrl = `${API_URL}${queryString}`;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      };

      // 2. Panggil API GET /api/reports/daily
      const response = await axios.get(finalUrl, config);
      
      // 3. Update State dengan data laporan
      setReports(response.data.reports || []); // Asumsi data laporan ada di response.data.reports
      setError(null);

    } catch (err) {
      // Penanganan Error (misal: 403 Forbidden atau 401 Unauthorized)
      const errorMessage = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "Gagal mengambil laporan. Pastikan Anda memiliki hak akses Admin.";
      
      setError(errorMessage);
      setReports([]);
      
      if (err.response && err.response.status === 401 || err.response.status === 403) {
        // Jika tidak diizinkan, hapus token dan redirect
        localStorage.removeItem('token');
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
   
    fetchReports(searchTerm, startDate, endDate);
  }, [navigate, startDate, endDate]); 
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    fetchReports(searchTerm, startDate, endDate);
  };

 
  const formatTime = (isoString) => {
    if (!isoString) return "Belum Check-Out";
    return new Date(isoString).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">
        Laporan Presensi Harian (Admin)
      </h1>

      {/* Kontrol Filter & Pencarian */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-gray-700">Filter Data</h3>

        {/* Filter Tanggal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
          <div className='flex items-end'>
            {/* Tombol Terapkan Filter */}
            <button
              onClick={() => fetchReports(searchTerm, startDate, endDate)}
              className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-150"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
        
        {/* Form Pencarian Nama */}
        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="Cari presensi berdasarkan nama pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg shadow-sm
focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md
hover:bg-blue-700 transition duration-150"
          >
            Cari Nama
          </button>
        </form>
      </div>


      {/* Area Status dan Data */}
      
      {loading && (
        <div className="flex justify-center items-center p-8 bg-blue-50 rounded-lg mb-4 shadow-inner">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-blue-700 font-medium">Memuat data laporan...</p>
        </div>
      )}

      {error && (
        <p className="text-red-600 bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-4 shadow-sm">{error}</p>
      )}

      {!loading && !error && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Check-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Check-Out
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((presensi) => (
                  <tr key={presensi.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {presensi.user ? presensi.user.nama : "N/A (Pengguna Dihapus)"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(presensi.checkIn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkOut
                        ? formatTime(presensi.checkOut)
                        : <span className="text-yellow-500 font-semibold">Belum Check-Out</span>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center text-gray-500 text-lg"
                  >
                    Tidak ada data laporan yang ditemukan untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReportPage;