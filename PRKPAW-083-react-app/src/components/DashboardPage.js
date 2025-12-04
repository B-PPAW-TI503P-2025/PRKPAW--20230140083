import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserData(decoded);
    } catch (err) {
      console.error('Token tidak valid:', err);
      navigate('/login');
    }
  }, [navigate]);

  const handleCheckIn = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/api/presensi/check-in',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage(response.data.message);
      setHasCheckedIn(true);
      setCheckInTime(new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/api/presensi/check-out',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage(response.data.message);
      setCheckOutTime(new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Check-out gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Dashboard Presensi
              </h1>
              <p className="text-gray-600 mt-2">
                Selamat datang, <span className="font-semibold">{userData.nama}</span>
              </p>
              <p className="text-sm text-gray-500">
                Role: <span className="font-medium capitalize">{userData.role}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Status Presensi */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Status Presensi Hari Ini
          </h2>

          {hasCheckedIn && !checkOutTime ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <div className="flex items-center mb-2">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-green-700 font-medium">
                  Anda sudah check-in
                </p>
              </div>
              <div className="ml-8 space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Waktu Check-in:</span> {checkInTime}
                </p>
              </div>
            </div>
          ) : checkOutTime ? (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <div className="flex items-center mb-2">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-blue-700 font-medium">
                  Presensi hari ini sudah selesai
                </p>
              </div>
              <div className="ml-8 space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Waktu Check-in:</span> {checkInTime}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Waktu Check-out:</span> {checkOutTime}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="text-yellow-700">
                Anda belum melakukan check-in hari ini
              </p>
            </div>
          )}

          {/* Messages */}
          {message && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-blue-700">{message}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!hasCheckedIn ? (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processing...' : 'Check-In'}
              </button>
            ) : !checkOutTime ? (
              <button
                onClick={handleCheckOut}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processing...' : 'Check-Out'}
              </button>
            ) : (
              <div className="flex-1 py-3 px-6 bg-gray-200 text-gray-600 font-semibold rounded-lg text-center">
                Presensi hari ini sudah selesai
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Informasi
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Check-in hanya dapat dilakukan sekali per hari</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Pastikan untuk check-out sebelum meninggalkan tempat kerja</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Data presensi akan tersimpan secara otomatis</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;