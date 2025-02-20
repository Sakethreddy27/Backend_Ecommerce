 const vendorController = require('../controller/vendorController');
 const express = require('express');

 const router = express.Router();

 router.post('/register',vendorController.vendorRegister);
 router.post('/login',vendorController.vendorLogin);

 router.get('/all-Vendors',vendorController.getAllVendors);
 router.get('/single-vendor/:id',vendorController.getVendorsById);

 module.exports = router;