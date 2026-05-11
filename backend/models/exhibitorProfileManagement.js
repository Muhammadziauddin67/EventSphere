import mongoose from "mongoose"

const exhibitorProfileSchema = new mongoose.Schema({
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    company: { type: String },
    description: { type: String },
    logo:        { type: String },   // image URL
    website:     { type: String },
    products:    [{ type: String }],
    contactInfo: {
        phone:   { type: String },
        address: { type: String },
    },
}, { timestamps: true })

export const ExhibitorProfile = mongoose.model("ExhibitorProfile", exhibitorProfileSchema)