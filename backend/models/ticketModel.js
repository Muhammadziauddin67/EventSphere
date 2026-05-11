import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema({
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expoId:      { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    tierName:    { type: String, required: true },
    price:       { type: Number, required: true },
    quantity:    { type: Number, default: 1 },
    status:      { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    bookingRef:  { type: String },
}, { timestamps: true })

export const Ticket = mongoose.model("Ticket", ticketSchema)