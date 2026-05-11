import mongoose from "mongoose"

const feedbackSchema = new mongoose.Schema({
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expoId:   { type: mongoose.Schema.Types.ObjectId, ref: "Expo" },
    type:     { type: String, enum: ["suggestion", "issue", "general"], default: "general" },
    message:  { type: String, required: true },
    status:   { type: String, enum: ["open", "reviewed", "resolved"], default: "open" },
}, { timestamps: true })

export const Feedback = mongoose.model("Feedback", feedbackSchema)