import mongoose from "mongoose"

const bookmarkSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expoId: { type: mongoose.Schema.Types.ObjectId, ref: "Expo", required: true },
}, { timestamps: true })

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema)