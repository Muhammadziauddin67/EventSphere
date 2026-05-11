import mongoose from "mongoose"

const boothSchema = new mongoose.Schema({
    expoId:       { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    boothNumber:  { type: String, required: true },
    size:         { type: String, enum: ["small", "medium", "large"] },
    status:       { type: String, enum: ["available", "reserved", "occupied"], default: "available" },
    assignedTo:   { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    position:     { x: { type: Number }, y: { type: Number } },
    products:     [{ type: String }], 
    staffInfo:    { type: String },
}, { timestamps: true })

export const Booth = mongoose.model("Booth", boothSchema)