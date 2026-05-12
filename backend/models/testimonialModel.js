import mongoose from "mongoose"

const testimonialSchema = new mongoose.Schema({
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quote:    { type: String, required: true },
    role:     { type: String },
    approved: { type: Boolean, default: false },
    showOn:   { type: String, enum: ["home", "about", "both"], default: "home" },
}, { timestamps: true })

export const Testimonial = mongoose.model("Testimonial", testimonialSchema)