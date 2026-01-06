const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        unique: true
    },

    userId: {
        type: String,
        required: true
    },

    serviceId: {
        type: String,
        required: true
    },

    bookingDate: Date,
    timeSlot: String,
    price: Number,
    notes: String,

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);