import mongoose from "mongoose"

const expoSchema = new mongoose.Schema({
    venueImage: { type: String },       
    title: { type: String, required: true },
    type: { type: String, enum: ["expo", "concert", "sports"], default: "expo" },
    category: { type: String },
    date: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true },
    city: { type: String },
    description: { type: String },
    theme: { type: String },
    artist: { type: String },
    team: { type: String },
    status: { type: String, enum: ["draft", "published", "closed"], default: "draft" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tickets: [{
        tierName: { type: String },
        price: { type: Number },
        capacity: { type: Number },
        sold: { type: Number, default: 0 },
    }],
    gallery: [{ type: String }],      
    mapLocation: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String },
    },
}, { timestamps: true })

export const Expo = mongoose.model("Expo", expoSchema)