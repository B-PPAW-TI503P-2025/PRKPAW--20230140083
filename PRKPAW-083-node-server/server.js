require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require('path'); 

const app = express();
const PORT = 3001;

// Cek JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET belum diset di .env");
  process.exit(1);
}

// Middleware global
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Folder statis untuk foto presensi
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging setiap request (opsional tapi membantu debug)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// IMPORT ROUTES
const bookRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");

// REGISTER ROUTES
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/presensi", presensiRoutes);       // check-in, check-out
app.use("/api/reports", reportRoutes);         // laporan admin

// Homepage
app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// Middleware 404 - route tidak ditemukan
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});