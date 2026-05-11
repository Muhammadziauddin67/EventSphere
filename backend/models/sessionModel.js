import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    expoId:    { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    title:     { type: String, required: true },
    speaker:   { type: String },
    topic:     { type: String },
    location:  { type: String },  // room/hall within expo
    startTime: { type: Date, required: true },
    endTime:   { type: Date, required: true },
    capacity:  { type: Number },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // bookmarked/registered
}, { timestamps: true })

export const Session = mongoose.model("Session", sessionSchema)