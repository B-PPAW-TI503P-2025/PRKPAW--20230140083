'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Presensi extends Model {
   
    static associate(models) {
     
      Presensi.belongsTo(models.User, {
        foreignKey: 'userId', // Ini adalah kolom Foreign Key yang menghubungkan ke tabel User
        as: 'user', // Alias untuk relasi, digunakan saat melakukan 'include'
      });
    }
  }
  Presensi.init({
    // 2. Kolom 'nama' dihapus karena diambil dari relasi User
    
    // Kolom userId dipertahankan sebagai Foreign Key
    userId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
    // Perbaikan nama kolom waktu menjadi CheckInTime (lebih deskriptif)
    checkInTime: { 
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Nilai default saat Check-In dibuat
    },
    
    // Perbaikan nama kolom waktu menjadi CheckOutTime
    checkOutTime: { 
      type: DataTypes.DATE,
      allowNull: true, // Boleh null jika belum Check-Out
    },
    
    // Penambahan kolom tanggal untuk query harian yang lebih mudah
    tanggal: { 
        type: DataTypes.DATEONLY, // Hanya menyimpan tanggal (YYYY-MM-DD)
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Presensi',
    // Opsional: Untuk mencegah duplikasi presensi Check-In per hari
    indexes: [
        {
            unique: true,
            fields: ['userId', 'tanggal']
        }
    ]
  });
  return Presensi;
};