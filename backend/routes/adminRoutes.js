import express from "express"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { isAdmin } from "../middleware/isAdmin.js"
import {
    createExpo, getExpos, updateExpo, deleteExpo,
    getApplications, updateApplicationStatus, assignBooth,
    createSession, getSessions, updateSession, deleteSession,
    getAnalytics, generateBooths, getBooths,
    getAdminMessages, getAdminConversation, sendAdminMessage
} from "../controllers/adminController.js"

const router = express.Router()

// all routes require login + admin role
router.use(isAuthenticated, isAdmin)

router.post("/expos",                       createExpo)
router.get("/expos",                        getExpos)
router.put("/expos/:id",                    updateExpo)
router.delete("/expos/:id",                 deleteExpo)

router.get("/applications",                 getApplications)
router.put("/applications/:id/status",      updateApplicationStatus)
router.put("/applications/:id/booth",       assignBooth)

router.post("/sessions",           createSession)
router.get("/sessions/:expoId",    getSessions)
router.put("/sessions/:id",        updateSession)
router.delete("/sessions/:id",     deleteSession)

router.post("/booths/generate",     generateBooths)
router.get("/booths/:expoId",       getBooths)

router.get("/analytics/:expoId",   getAnalytics)
router.get("/messages",              getAdminMessages)
router.get("/messages/:userId",      getAdminConversation)
router.post("/messages",             sendAdminMessage)

export default router