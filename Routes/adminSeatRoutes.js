const express = require("express");
const router = express.Router();
const Seat = require("../models/seat");
const { v4: uuidv4 } = require("uuid");


// ✅ ADMIN: CREATE SEATS (example: 100)
router.post("/create-seats", async(req, res) => {
    try {
        const { totalSeats } = req.body; // 100

        const seats = [];

        for (let i = 1; i <= totalSeats; i++) {
            seats.push({
                seatId: uuidv4(),
                seatNumber: i
            });
        }

        await Seat.insertMany(seats);

        res.status(201).json({
            success: true,
            message: `${totalSeats} seats created successfully`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;