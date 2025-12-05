const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/permissionMiddleware');
const { body, validationResult } = require('express-validator');

router.use(authenticateToken);
router.post('/check-in', [authenticateToken, presensiController.upload.single('image')], presensiController.CheckIn);
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

router.put("/:id", presensiController.updatePresensi);
router.delete('/:id', presensiController.deletePresensi);

//VALIDASI FORMAT TANGGAL SAAT UPDATE//
router.put(
  '/:id',
  [
    body('checkIn')
      .optional()
      .isISO8601()
      .withMessage("Format checkIn tidak valid (gunakan format 'YYYY-MM-DD HH:mm:ss')"),
    body('checkOut')
      .optional()
      .isISO8601()
      .withMessage("Format checkOut tidak valid (gunakan format 'YYYY-MM-DD HH:mm:ss')"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Input tidak valid',
        errors: errors.array(),
      });
    }
    next();
  },
  presensiController.updatePresensi
);

module.exports = router;