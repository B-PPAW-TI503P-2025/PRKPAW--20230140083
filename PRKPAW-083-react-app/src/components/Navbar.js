import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// PERBAIKAN KRITIS: Menggunakan Named Import { jwtDecode }
import { jwtDecode } from 'jwt-decode'; 

/**
 * Komponen Navbar untuk aplikasi.
 * Menampilkan nama pengguna, menu berdasarkan peran (role), dan tombol Logout.
 */
function Navbar() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fungsi ini dipanggil hanya sekali saat komponen dimuat
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // 2. Decode token untuk mendapatkan data pengguna
        const decoded = jwtDecode(token);
        
        // Pastikan token belum kadaluarsa dan data pengguna ada
        // exp * 1000 mengubah detik Unix menjadi milidetik JS
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setUserName(decoded.nama || 'Pengguna'); // Ambil user.nama
          setUserRole(decoded.role || 'user');    // Ambil user.role
        } else {
          // Token kadaluarsa, hapus dan paksa logout
          handleLogout();
        }
      } catch (error) {
        // Jika token tidak valid atau error saat decode
        console.error("Gagal mendecode token:", error);
        handleLogout();
      }
    } else {
      // Jika tidak ada token (misal: baru load), reset state.
      // Catatan: Jika token tidak ada, pengguna akan diarahkan ke /login 
      // oleh komponen router <ProtectedRoute> di App.js
      setUserName('');
      setUserRole('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependensi kosong: hanya jalankan saat mount

  /**
   * Fungsi untuk proses Logout.
   * Menghapus token dan mengarahkan pengguna ke halaman login.
   */
  const handleLogout = () => {
    // Menghapus token dari Local Storage
    localStorage.removeItem('token');
    
    // Reset state lokal
    setUserName('');
    setUserRole('');

    // Navigasi ke halaman /login
    navigate('/login');
  };

  // Jika tidak ada nama pengguna, tampilkan Navbar kosong atau navigasi ke login
  if (!userName) {
    return null; // Tidak menampilkan Navbar jika pengguna belum terautentikasi
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-indigo-700 shadow-lg z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Nama Aplikasi */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-white text-2xl font-bold tracking-wider">
              PRKPAW App
            </Link>
          </div>

          {/* Link Navigasi dan Info Pengguna */}
          <div className="flex items-center space-x-6">
            
            {/* Info Pengguna */}
            <span className="text-white text-sm font-light hidden sm:inline">
              Halo, <span className="font-semibold">{userName}</span> (Role: {userRole.toUpperCase()})
            </span>
            
            {/* Menu Default */}
            <Link 
              to="/dashboard" 
              className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Dashboard
            </Link>
            
            {/* Tampilkan Menu Presensi (untuk semua user, bisa diganti) */}
            <Link 
              to="/presensi" 
              className="text-indigo-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              Presensi
            </Link>

            {/* Tampilkan Menu Khusus Admin */}
            {userRole === 'admin' && (
              <Link 
                to="/laporan-admin" 
                className="text-yellow-300 bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-bold transition duration-150 shadow-md"
              >
                Laporan Admin
              </Link>
            )}

            {/* Tombol Logout */}
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 bg-red-500 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-red-600 transition duration-150 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;