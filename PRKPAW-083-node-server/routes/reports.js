const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');

// Endpoint: GET /api/reports/daily
// Fungsi: mencari presensi berdasarkan nama atau rentang tanggal
// Contoh:
//   GET /api/reports/daily?nama=SALSA
//   GET /api/reports/daily?tanggalMulai=2025-10-01&tanggalSelesai=2025-10-31
// Middleware: hanya bisa diakses oleh admin
router.get('/daily', authenticateToken, isAdmin, reportController.getDailyReport);

module.exports = router;