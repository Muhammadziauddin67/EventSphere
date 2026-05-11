import mongoose from "mongoose";

const authSessionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})
export const AuthSession = mongoose.model("AuthSession", authSessionSchema)