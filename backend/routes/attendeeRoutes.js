import express from "express"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import {
    getPublishedExpos, getExpoDetails, getExpoSessions,
    getExpoExhibitors, getExpoFloorPlan,
    bookTicket, getMyTickets,
    toggleBookmark, getMyBookmarks, checkBookmark,
    registerForSession, getMyRegistrations,
    submitFeedback, searchEvents, cancelTicket, getExhibitorDetail, getChatContacts, sendChatMessage, getChatMessages
} from "../controllers/attendeeController.js"

const router = express.Router()

// Public browsing — no auth needed
router.get("/expos",                         getPublishedExpos)
router.get("/expos/search",                  searchEvents)
router.get("/expos/:expoId",                 getExpoDetails)
router.get("/expos/:expoId/sessions",        getExpoSessions)
router.get("/expos/:expoId/exhibitors",      getExpoExhibitors)
router.get("/expos/:expoId/floorplan",       getExpoFloorPlan)

// Auth required
router.post("/tickets",                      isAuthenticated, bookTicket)
router.get("/my-tickets",                    isAuthenticated, getMyTickets)
router.put("/tickets/:ticketId/cancel", isAuthenticated, cancelTicket)
router.post("/bookmarks/:expoId",            isAuthenticated, toggleBookmark)
router.get("/bookmarks",                     isAuthenticated, getMyBookmarks)
router.get("/bookmarks/:expoId/check",       isAuthenticated, checkBookmark)
router.post("/sessions/:sessionId/register", isAuthenticated, registerForSession)
router.get("/my-registrations",              isAuthenticated, getMyRegistrations)
router.post("/feedback",                     isAuthenticated, submitFeedback)
router.get("/exhibitors/:applicationId", getExhibitorDetail)

router.get("/chat/contacts",        isAuthenticated, getChatContacts)
router.post("/chat/message",        isAuthenticated, sendChatMessage)
router.get("/chat/:userId",         isAuthenticated, getChatMessages)


export default router