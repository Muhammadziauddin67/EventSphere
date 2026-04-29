import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String,required:true},
    isVerified:{type:Boolean, default:false},
    isLoggedIn:{type:Boolean, default:false},
    token:{type:String, default:null},
    otp:{type:String,required:true},
    otpExpiry:{type:String,required:true},
},{timestamps:true})
export const User = mongoose.model("User",userSchema)