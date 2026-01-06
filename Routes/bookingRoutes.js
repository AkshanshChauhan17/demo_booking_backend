const express = require("express");
const router = express.Router();
const Seat = require("../models/s.eat");
const { v4: uuidv4 } = require("uuid");


// ✅ GET ALL SEATS
router.get("/available", async(req, res) => {
    try {
        const seats = await Seat.find({});
        res.json({ success: true, seats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// ✅ USER BOOK A SEAT (REAL-TIME)
router.post("/book", async(req, res) => {
    try {
        const { seatNumber, userId } = req.body;

        const seat = await Seat.findOne({ seatNumber });

        if (!seat)
            return res.status(404).json({ success: false, message: "Seat not found" });

        if (seat.isBooked)
            return res.status(400).json({ success: false, message: "Seat already booked" });

        seat.isBooked = true;
        seat.bookedBy = userId;
        seat.bookingId = uuidv4();

        await seat.save();

        // 🔥 Emit update to all clients
        const io = req.app.get("io");
        const seats = await Seat.find({});
        io.emit("seatsUpdated", seats);

        res.json({
            success: true,
            message: "Seat booked successfully",
            seat
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// ❌ CANCEL SEAT (REAL-TIME)
router.delete("/cancel/:seatNumber", async(req, res) => {
    try {
        const seat = await Seat.findOne({ seatNumber: req.params.seatNumber });

        if (!seat || !seat.isBooked)
            return res.status(404).json({ success: false, message: "Booking not found" });

        seat.isBooked = false;
        seat.bookedBy = null;
        seat.bookingId = null;

        await seat.save();

        // 🔥 Emit update
        const io = req.app.get("io");
        const seats = await Seat.find({});
        io.emit("seatsUpdated", seats);

        res.json({ success: true, message: "Seat booking cancelled" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;