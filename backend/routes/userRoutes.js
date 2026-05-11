import express from "express"
import { changePassword, forgotPassword, loginUser, logoutUser, registerUser, verification, verifyOTP, createAdmin, refreshToken } from "../controllers/userController.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { isAdmin } from "../middleware/isAdmin.js"
import { userSchema, validateUser } from "../validators/userValidate.js"


const router = express.Router()
router.post('/register',validateUser(userSchema),registerUser)
router.post('/verify',verification)
router.post('/login',loginUser)
router.post('/logout',isAuthenticated,logoutUser)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp/:email', verifyOTP)
router.post('/change-password/:email', changePassword)
router.post('/create-admin', isAuthenticated, isAdmin, createAdmin)
router.post('/refresh-token', refreshToken)


export default router