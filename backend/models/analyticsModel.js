import mongoose from "mongoose"

const analyticsSchema = new mongoose.Schema({
    expoId:          { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
    totalAttendees:  { type: Number, default: 0 },
    boothTraffic:    [{ 
        boothId:     { type: mongoose.Schema.Types.ObjectId, ref: "Booth" },
        visits:      { type: Number, default: 0 }
    }],
    sessionPopularity: [{
        sessionId:   { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
        registrations: { type: Number, default: 0 }
    }],
    date:            { type: Date, default: Date.now },
}, { timestamps: true })

export const Analytics = mongoose.model("Analytics", analyticsSchema)