import express from "express"
import { changePassword, forgotPassword, logoutUser, registerUser, verification, verifyOTP } from "../controllers/userController"
import { isAuthenticated } from "../middleware/isAuthenticated"
import { userSchema, validateUser } from "../validators/userValidate"

const router = express.Router()
router.post('/register',validateUser(userSchema),registerUser)
router.post('/verify',verification)
router.post('/login',verification)
router.post('/logout',isAuthenticated,logoutUser)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOTP)
router.post('/change-password/:email', changePassword)
export default router