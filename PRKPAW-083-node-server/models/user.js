'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      // 1. Implementasi relasi: User.hasMany(Presensi)
      User.hasMany(models.Presensi, {
        foreignKey: 'userId', // Ini adalah kolom Foreign Key yang akan ada di tabel Presensi
        as: 'presensiList', // Alias untuk relasi (digunakan saat melakukan 'include')
        onDelete: 'CASCADE', // Opsi: Jika user dihapus, data presensi terkait ikut terhapus
      });
    }
  }
  User.init({
    // Kolom 'id' (Primary Key) secara default akan ditambahkan oleh Sequelize
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true 
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('mahasiswa', 'admin'), 
      allowNull: false,
      defaultValue: 'mahasiswa',
      validate: {
        isIn: [['mahasiswa', 'admin']] 
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};