require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

// ✅ Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "*", // Vite frontend
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Make io accessible in routes
app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.use("/api/admin/seats", require("./Routes/adminSeatRoutes"));
app.use("/api/seats", require("./Routes/bookingRoutes"));

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});