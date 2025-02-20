const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
    try {
        console.log("Received Body:", req.body);
        console.log("Received File:", req.file);

        // Get vendorId from JWT token (middleware should set this)
        const vendorId = req.vendorId;
        if (!vendorId) {
            return res.status(401).json({ message: "Unauthorized: Vendor ID not found in token" });
        }

        const { firmName, area, category, region, offers } = req.body;
        const image = req.file ? req.file.filename : null;

        // Validate required fields
        if (!firmName || firmName.trim() === '') {
            return res.status(400).json({ message: "Firm name is required" });
        }
        // Check if vendor exists
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        // Check if the firm already exists under the same vendor
        const existingFirm = await Firm.findOne({ firmName, vendor: vendor._id });
        if (existingFirm) {
            return res.status(400).json({ message: "Firm already exists for this vendor" });
        }

        // Create and save new firm
        const firm = new Firm({ firmName, area, category, region, offers, image, vendor: vendor._id });
        await firm.save();

        // Ensure vendor.firm is an array before pushing
        vendor.firm = vendor.firm || [];
        vendor.firm.push(firm._id);
        await vendor.save();

        return res.status(201).json({ message: "Firm added successfully", firm, vendor });
    } catch (error) {
        console.error("Error adding firm:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
const deleteFirmById = async(req,res)=>{

    try {
        const firmId = req.params.firmId;

        const deleteProduct= await Product.findByIdAndDelete(firmId)

        if(!deleteProduct){
            return res.status(404).json({error:"Internal Server Error"})
        }
    } catch (error) {
        
    }
};
// Export controller with middleware
module.exports = { addFirm: [upload.single("image"), addFirm],deleteFirmById};
