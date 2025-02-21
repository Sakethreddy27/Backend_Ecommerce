const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const bodyParser = require('body-parser');
const cors = require('cors');
const firmRoutes = require('./routes/firmroutes');
const productRoutes = require('./routes/productRoutes');
const app = express();

const port = process.env.PORT || 5000;

dotenv.config();

const mongoURI = process.env.MONGO_URI;
console.log("MongoDB URI type:", typeof mongoURI);
console.log("First few chars:", mongoURI?.substring(0, 12));

// Debugging to check MONGO_URI
console.log("MongoDB URI:", process.env.MONGO_URI);

mongoose.connect(mongoURI)
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((error) => {
    console.error(" MongoDB Connection Error:", error);
    process.exit(1); // Stop app if MongoDB fails to connect
});

// Listen for MongoDB errors after initial connection
mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

// Middleware
app.use(cors());  // Enable CORS for all origins
app.use(express.json());  // Middleware to parse JSON bodies
app.use('/vendor', vendorRoutes);  // Vendor routes
app.use('/firm', firmRoutes);  // Firm routes
app.use('/product', productRoutes);  // Product routes
app.use('/uploads', express.static('uploads'));  // Serve static files

// Main route
app.get('/', (req, res) => {
    res.send("Welcome to Swugy");
});

// Start server
app.listen(port, () => {
    console.log(`Server running successfully at http://localhost:${port}`); 
});
