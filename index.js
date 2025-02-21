const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const bodyParser = require('body-parser');
const cors = require('cors');
const firmRoutes = require('./routes/firmroutes');
const productRoutes = require('./routes/productRoutes');
const app = express();

const port = process.env.PORT || 5000;

dotEnv.config();

// Debugging to check MONGO_URI
console.log("MongoDB URI:", process.env.MONGO_URI);

mongoose.connect('mongodb+srv://sakethreddy:saketh123@cluster0.33mor.mongodb.net/Project1?retryWrites=true&w=majority&appName=Cluster0')
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
