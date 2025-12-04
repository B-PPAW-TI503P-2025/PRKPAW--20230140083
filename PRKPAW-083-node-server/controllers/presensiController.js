const { Presensi, User } = require("../models"); // Pastikan model User juga diimpor untuk join data
const { format, isToday } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const todayDateString = format(new Date(), "yyyy-MM-dd");

// --- Helper untuk mendapatkan waktu dan tanggal dalam zona waktu WIB ---
const getWIBTime = (date) => utcToZonedTime(date, timeZone);

/**
 * Controller untuk Check-In
 */
exports.CheckIn = async (req, res) => {
  try {
    // Ambil ID dari JWT payload
    const { id: userId, nama: userName } = req.user;
    
    // Perbaikan: Gunakan waktu sekarang dan tanggal string hari ini untuk query
    const waktuSekarang = getWIBTime(new Date());

    // 1. Cek duplikasi: Cari record hari ini (tanggal) yang dimiliki user
    const existingRecord = await Presensi.findOne({
      where: { 
        userId: userId, 
        tanggal: todayDateString // Filter berdasarkan tanggal hari ini
      },
    });

    if (existingRecord) {
      // Perbaikan pesan: Sudah check-in HARI INI
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // 2. Buat data baru
    const newRecord = await Presensi.create({
      userId: userId,
      // PERBAIKAN PENTING: Kolom 'nama' dihapus dari sini.
      checkInTime: waktuSekarang, // Menggunakan checkInTime
      tanggal: todayDateString,
    });
    
    // Format data untuk respons
    const formattedData = {
        userId: newRecord.userId,
        // PERBAIKAN: Nama diambil dari req.user.nama (atau bisa di-join dari model User)
        nama: userName, 
        checkInTime: format(newRecord.checkInTime, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOutTime: null, // Menggunakan checkOutTime
        tanggal: newRecord.tanggal,
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

/**
 * Controller untuk Check-Out
 */
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = getWIBTime(new Date());

    // Cari record Check-In yang hari ini dan belum Check-Out
    const recordToUpdate = await Presensi.findOne({
      where: { 
        userId: userId, 
        checkOutTime: null, // PERBAIKAN: Menggunakan checkOutTime
        tanggal: todayDateString // Filter berdasarkan tanggal hari ini
      },
    });

    if (!recordToUpdate) {
      return res.status(400).json({ // Status 400 lebih tepat daripada 404
        message: "Tidak ditemukan catatan check-in yang aktif hari ini untuk di-check-out.",
      });
    }

    // 5. Update kolom checkOutTime
    recordToUpdate.checkOutTime = waktuSekarang;
    await recordToUpdate.save();

    // Format data untuk respons
    const formattedData = {
        userId: recordToUpdate.userId,
        nama: userName, // Diambil dari token
        checkInTime: format(recordToUpdate.checkInTime, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOutTime: format(recordToUpdate.checkOutTime, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        tanggal: recordToUpdate.tanggal,
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

/**
 * Controller untuk Menghapus Presensi
 */
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const presensiId = req.params.id;
    
    // Perbaikan: Tambahkan 'include: User' jika ingin memverifikasi role admin
    const recordToDelete = await Presensi.findByPk(presensiId); 

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }
    
    // Perbaikan: Otorisasi. Hanya pemilik atau Admin yang boleh menghapus
    if (recordToDelete.userId !== userId && role !== 'admin') { 
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda tidak diizinkan menghapus catatan ini." });
    }
    
    await recordToDelete.destroy();
    // Menggunakan 200 OK dengan pesan (atau 204 No Content)
    res.status(200).json({ message: "Catatan presensi berhasil dihapus." });
    
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

/**
 * Controller untuk Memperbarui Presensi
 */
exports.updatePresensi = async (req, res) => {
  try {
    const { id: requesterId, role } = req.user;
    const presensiId = req.params.id;
    // PERBAIKAN: Hanya izinkan update checkInTime atau checkOutTime. Kolom 'nama' dihapus.
    const { checkInTime, checkOutTime } = req.body; 
    
    if (checkInTime === undefined && checkOutTime === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkInTime atau checkOutTime).",
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId);
    
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    // Otorisasi: Hanya pemilik atau Admin yang boleh update
    if (recordToUpdate.userId !== requesterId && role !== 'admin') {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda tidak diizinkan mengubah catatan ini." });
    }

    // Update kolom yang tersedia (gunakan operator nullish coalescing ?? atau || jika ingin mempertahankan nilai lama)
    // Gunakan ?? jika Anda ingin mengizinkan null di req.body
    recordToUpdate.checkInTime = checkInTime || recordToUpdate.checkInTime; 
    recordToUpdate.checkOutTime = checkOutTime || recordToUpdate.checkOutTime; 
    
    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};