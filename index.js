const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const cors = require('cors');
const path = require('path');
const firmRoutes = require('./routes/firmroutes');
const productroutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Environment setup
dotEnv.config();

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI environment variable is missing!");
  process.exit(1);
}

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  retryWrites: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch((error) => {
  console.error("MongoDB connection failed:", error);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productroutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Default route
app.get('/', (req, res) => {
  res.send("Welcome to Swugy");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Server start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running successfully on port ${PORT}`);
});