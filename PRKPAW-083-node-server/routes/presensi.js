const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');

const { verifyToken, isAdmin } = require('../middleware/permissionMiddleware');

router.use(verifyToken); // semua butuh token

router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

// yang bawah hanya admin
router.put('/:id', isAdmin, presensiController.updatePresensi);
router.delete('/:id', isAdmin, presensiController.deletePresensi);

module.exports = router;
