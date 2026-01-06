const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
    seatId: {
        type: String,
        required: true,
        unique: true
    },

    seatNumber: {
        type: Number,
        required: true
    },

    isBooked: {
        type: Boolean,
        default: false
    },

    bookedBy: {
        type: String, // userId
        default: null
    },

    bookingId: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model("Seat", seatSchema);