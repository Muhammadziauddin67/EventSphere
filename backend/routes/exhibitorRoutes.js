import express from "express"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { isExhibitor } from "../middleware/isExhibitor.js"
import { upload } from "../middleware/upload.js"
import {
    applyForExpo, getMyApplications, getAvailableExpos,
    updateProfile, getMyProfile,
    getMyBooth, updateBoothDetails,
    sendMessage, getMyMessages, getConversation,
    getContacts,
    getExpoBooths, uploadLogo
} from "../controllers/exhibitorController.js"

const router = express.Router()
router.use(isAuthenticated, isExhibitor)

// Expos
router.get("/expos",                 getAvailableExpos)

// Applications
router.post("/apply",                applyForExpo)
router.get("/applications",          getMyApplications)

// Profile
router.get("/profile",               getMyProfile)
router.put("/profile",               updateProfile)

// Booth
router.get("/booth/:expoId",         getMyBooth)
router.put("/booth/:boothId",        updateBoothDetails)
router.get("/booths/:expoId",        getExpoBooths)

// Messaging
router.post("/messages",             sendMessage)
router.get("/messages",              getMyMessages)
router.get("/messages/:userId",      getConversation)
router.get("/contacts",              getContacts)
router.post("/profile/logo", upload.single('logo'), uploadLogo)

export default router