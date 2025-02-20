const Firm = require("../models/Firm");
const Product = require("../models/Product");
const multer = require("multer");
const fs = require("fs");
const path = require("path"); // Required for path extensions

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

const addProduct = async(req, res) => {
    try {
        const { productName, price, category, offers, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmid; // Get firmId from params

        console.log("Extracted firmId:", firmId); // Debugging log

        // Check if the firm exists
        const firm = await Firm.findById(firmId);
        if (!firm) {
            console.log("Firm not found with ID:", firmId); // Debugging log
            return res.status(400).json({ error: "No firm found" });
        }

        console.log("Firm found:", firm); // Debugging log

        // Create the new product and link it to the firm
        const product = new Product({
            productName,
            price,
            category,
            offers,
            bestSeller,
            description,
            image,
            firm: firm._id,  // Link product to the firm
        });

        // Save the product to the database
        const savedProduct = await product.save();

        // Ensure the firm.products is initialized before pushing the new product
        if (!firm.Product) {
            firm.Product = [];  // Initialize if undefined
        }

        // Link product to the firm by adding product ID to firm's products array
        firm.Product.push(savedProduct);

        console.log("Firm's updated products:", firm.products); // Debugging log

        await firm.save();

        return res.status(200).json({ message: "Product added successfully", firm, product });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const getProductByFirm = async(req,res)=>{
    try { 

        const firmId = req.params.firmid;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(500).json({ error: "No firm found" });

        }

        const restaurantName = firm.firmName;
        const products = await Product.find(({firm:firmId}));

        res.status(200).json({restaurantName ,products});
        
        
    } catch (error) {
        console.error(error);
 return res.status(500).json({ message: "Internal server error" });

        
    }
}

const deleteProductsById = async (req, res) => {
    try {
        const productId = req.params.productId;
        console.log("Requested product ID for deletion:", productId); // 🕵️

        // First find the product to get firm reference
        const product = await Product.findById(productId);
        console.log("Product found in DB:", product); // 🕵️

        if (!product) {
            console.log(`Product ${productId} does not exist`); // 🕵️
            return res.status(404).json({ error: "Product not found" });
        }

        // Delete the product
        await Product.findByIdAndDelete(productId);
        console.log("Product deleted from DB"); // 🕵️

        // Remove from firm's product array
        const firm = await Firm.findById(product.firm);
        console.log("Associated firm:", firm); // 🕵️

        if (firm) {
            firm.Product.pull(productId);
            await firm.save();
            console.log("Product reference removed from firm"); // 🕵️
        }
        
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//Corrected Export
module.exports = { addProduct, upload ,getProductByFirm,deleteProductsById};
