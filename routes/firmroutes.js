const express = require('express');
const firmController = require('../controller/frimController'); // Fixed typo
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Route with all required middleware


router.post(
    '/add-firm',
    verifyToken,
    firmController.addFirm[0], // Multer middleware (upload.single("image"))
    firmController.addFirm[1]  // addFirm controller
  );
  router.delete(':/firmId/firm',firmController.deleteFirmById);
module.exports = router;