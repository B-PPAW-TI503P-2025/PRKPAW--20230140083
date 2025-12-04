import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

// Import komponen baru
import AttendancePage from './components/AttendancePage';
import ReportPage from './components/ReportPage';

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

/**
 * Middleware Sederhana: Mengecek Role Admin
 * Catatan: Harus diperbaiki untuk membaca role dari token JWT yang benar.
 * Untuk demo ini, kita asumsikan jika token ada, dia bukan admin, kecuali kita tambahkan pengecekan role.
 * Karena kita belum tahu cara token JWT Anda, fungsi ini hanya mengarahkan ke dashboard jika bukan admin.
 */
const isAdmin = () => {
    // Implementasi yang benar harus:
    // 1. Mengambil token
    // 2. Mendekode token untuk mendapatkan role
    // 3. Mengembalikan true jika role adalah 'admin'
    
    // Saat ini, kita hanya melakukan pengecekan token sebagai placeholder
    return isAuthenticated(); // Ganti dengan logika pengecekan role yang sebenarnya
};

// =======================================================
// Komponen Pelindung (Guard) untuk Rute Non-Admin
// =======================================================
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// =======================================================
// Komponen Pelindung (Guard) untuk Rute Admin
// =======================================================
const AdminRoute = ({ children }) => {
    if (!isAdmin()) {
        // Jika tidak berwenang, arahkan ke dashboard atau halaman login
        return <Navigate to="/dashboard" replace />; 
    }
    return children;
};


function App() {
  return (
    <Router>
      {/* Navbar terlihat di semua halaman kecuali login dan register */}
      <div className="flex flex-col min-h-screen">
          <Routes>
              {/* Rute tanpa Navbar (Auth Pages) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<LayoutWithNavbar />} />
          </Routes>
      </div>
    </Router>
  );
}

// Layout yang menyertakan Navbar (untuk Protected Routes dan Home)
function LayoutWithNavbar() {
    return (
        <>
            <Navbar />
            <main className="flex-grow pt-16"> {/* pt-16 mengimbangi tinggi navbar */}
                <Routes>
                    {/* Rute Publik */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Rute Terproteksi Pengguna (Butuh Login) */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/presensi" 
                        element={
                            <ProtectedRoute>
                                <AttendancePage />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Rute Terproteksi Admin (Butuh Admin Role) */}
                    <Route 
                        path="/laporan-admin" 
                        element={
                            <AdminRoute>
                                <ReportPage />
                            </AdminRoute>
                        } 
                    />

                    {/* Catch-all route untuk Not Found */}
                    <Route path="*" element={<h1 className="text-center mt-10 text-xl">404 - Halaman Tidak Ditemukan</h1>} />
                </Routes>
            </main>
        </>
    );
}

export default App;