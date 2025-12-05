import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex flex-col items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center w-full max-w-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Selamat Datang! 🎉
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Kamu berhasil login ke Dashboard. Sekarang kamu bisa menjelajah fitur
          aplikasi ini.
        </p>

        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;