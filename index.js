const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const bodyParser = require('body-parser');
const cors = require('cors');
const firmRoutes = require('./routes/firmroutes');
const productRoutes = require('./routes/productRoutes');
const app = express();

const PORT = process.env.PORT || 4000;

dotEnv.config();

// Debugging to check MONGO_URI
console.log("MongoDB URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, // 60 seconds timeout for connection
    socketTimeoutMS: 60000, // 60 seconds socket timeout
})
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
app.listen(PORT, () => {
    console.log(`Server running successfully at http://localhost:${PORT}`);
});
