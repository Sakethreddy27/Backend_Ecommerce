const express = require('express');
const { addProduct, upload, getProductByFirm, deleteProductsById} = require("../controller/productcontroller");

const router = express.Router();

// ✅ Apply multer middleware here
router.post('/addProduct/:firmid', upload.single('image'), addProduct);
router.get('/:firmid/products',getProductByFirm);
router.delete('/:productId',deleteProductsById);
module.exports = router;
