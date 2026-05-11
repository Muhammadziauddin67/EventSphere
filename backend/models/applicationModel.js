import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema({
    expoId:       { type: mongoose.Schema.Types.ObjectId, ref: "Expo",  required: true },
    exhibitorId:  { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
    company:      { type: String, required: true },
    description:  { type: String },
    products:     { type: String },   
    documents:    [{ type: String }], 
    status:       { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    boothId:      { type: mongoose.Schema.Types.ObjectId, ref: "Booth", default: null },
}, { timestamps: true })

export const Application = mongoose.model("Application", applicationSchema)