import { Expo } from "../models/expoModel.js"
import { Session } from "../models/sessionModel.js"
import { Booth } from "../models/boothModel.js"
import { Application } from "../models/applicationModel.js"
import { Feedback } from "../models/feedbackModel.js"
import { Ticket } from "../models/ticketModel.js"
import { Bookmark } from "../models/bookmarkModel.js"
import { sendTicketConfirmation } from "../emailVerify/ticketConfirmMail.js"
import { User } from "../models/userModels.js"
import { ExhibitorProfile } from "../models/exhibitorProfileManagement.js"
import { Message } from "../models/messageModel.js"

// ── Browse ────────────────────────────────────────────────────────────────
export const getPublishedExpos = async (req, res) => {
    try {
        const { type, city, category, search, dateFrom, dateTo } = req.query

        const filter = { status: "published" }

        if (type) filter.type = type
        if (city) filter.city = new RegExp(city, "i")
        if (category) filter.category = new RegExp(category, "i")

        if (search) {
            filter.$or = [
                { title: new RegExp(search, "i") },
                { description: new RegExp(search, "i") },
                { artist: new RegExp(search, "i") },
                { team: new RegExp(search, "i") },
                { location: new RegExp(search, "i") },
            ]
        }
        if (dateFrom || dateTo) {
            filter.date = {}
            if (dateFrom) filter.date.$gte = new Date(dateFrom)
            if (dateTo)   filter.date.$lte = new Date(new Date(dateTo).setHours(23,59,59))
        }

        const expos = await Expo.find(filter).sort({ date: 1 })

        return res.status(200).json({ success: true, data: expos })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const searchEvents = async (req, res) => {
    try {
        const { q } = req.query
        const expos = await Expo.find({
            status: "published",
            $or: [
                { title: new RegExp(q, "i") },
                { city: new RegExp(q, "i") },
                { artist: new RegExp(q, "i") },
                { team: new RegExp(q, "i") },
                { category: new RegExp(q, "i") },
            ]
        }).sort({ date: 1 }).limit(20)
        return res.status(200).json({ success: true, data: expos })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getExpoDetails = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.expoId)
        if (!expo) return res.status(404).json({ success: false, message: "Event not found" })
        return res.status(200).json({ success: true, data: expo })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getExpoSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ expoId: req.params.expoId }).sort({ startTime: 1 })
        return res.status(200).json({ success: true, data: sessions })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getExpoExhibitors = async (req, res) => {
    try {
        const applications = await Application.find({
            expoId: req.params.expoId, status: "approved"
        })
            .populate("exhibitorId", "username email")
            .populate("boothId", "boothNumber position")
        return res.status(200).json({ success: true, data: applications })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getExpoFloorPlan = async (req, res) => {
    try {
        const booths = await Booth.find({ expoId: req.params.expoId })
            .populate("assignedTo", "username")
        return res.status(200).json({ success: true, data: booths })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// ── Tickets ───────────────────────────────────────────────────────────────
export const bookTicket = async (req, res) => {
    try {
        const { expoId, tierName, quantity } = req.body
        if (!expoId || !tierName)
            return res.status(400).json({ success: false, message: "Expo and tier required" })

        const expo = await Expo.findById(expoId)
        if (!expo) return res.status(404).json({ success: false, message: "Event not found" })

        const tier = expo.tickets.find(t => t.tierName === tierName)
        if (!tier) return res.status(404).json({ success: false, message: "Ticket tier not found" })

        const qty = quantity || 1
        if (tier.sold + qty > tier.capacity)
            return res.status(400).json({ success: false, message: "Not enough tickets available" })

        // increment sold count
        tier.sold += qty
        await expo.save()

        const bookingRef = `ES-${Date.now()}-${Math.floor(Math.random() * 9999)}`
        const ticket = await Ticket.create({
            userId: req.userId,
            expoId,
            tierName,
            price: tier.price * qty,
            quantity: qty,
            bookingRef,

        })
        const user = await User.findById(req.userId)
        await sendTicketConfirmation(user.email, {
            username: user.username,
            eventTitle: expo.title,
            tierName,
            quantity: qty,
            price: tier.price * qty,
            bookingRef,
            date: expo.date,
            location: expo.location,
        })
        return res.status(201).json({ success: true, message: "Ticket booked!", data: ticket })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            userId: req.userId,
            status: { $ne: "cancelled" }
        })
            .populate("expoId", "title date location city type")
            .sort({ createdAt: -1 })

        return res.status(200).json({ success: true, data: tickets })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const cancelTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ _id: req.params.ticketId, userId: req.userId })
        if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" })
        if (ticket.status === 'cancelled')
            return res.status(400).json({ success: false, message: "Already cancelled" })

        ticket.status = 'cancelled'
        await ticket.save()

        // restore sold count
        await Expo.findOneAndUpdate(
            { _id: ticket.expoId, 'tickets.tierName': ticket.tierName },
            { $inc: { 'tickets.$.sold': -ticket.quantity } }
        )
        return res.status(200).json({ success: true, message: "Booking cancelled" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
// ── Bookmarks ─────────────────────────────────────────────────────────────
export const toggleBookmark = async (req, res) => {
    try {
        const { expoId } = req.params
        const existing = await Bookmark.findOne({ userId: req.userId, expoId })
        if (existing) {
            await Bookmark.deleteOne({ userId: req.userId, expoId })
            return res.status(200).json({ success: true, bookmarked: false, message: "Bookmark removed" })
        }
        await Bookmark.create({ userId: req.userId, expoId })
        return res.status(201).json({ success: true, bookmarked: true, message: "Bookmarked!" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getMyBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ userId: req.userId })
            .populate("expoId")
            .sort({ createdAt: -1 })
        return res.status(200).json({ success: true, data: bookmarks })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const checkBookmark = async (req, res) => {
    try {
        const existing = await Bookmark.findOne({ userId: req.userId, expoId: req.params.expoId })
        return res.status(200).json({ success: true, bookmarked: !!existing })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// ── Sessions ──────────────────────────────────────────────────────────────
export const registerForSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.sessionId)
        if (!session) return res.status(404).json({ success: false, message: "Session not found" })
        if (session.attendees.includes(req.userId))
            return res.status(400).json({ success: false, message: "Already registered" })
        if (session.capacity && session.attendees.length >= session.capacity)
            return res.status(400).json({ success: false, message: "Session is full" })
        session.attendees.push(req.userId)
        await session.save()
        return res.status(200).json({ success: true, message: "Registered for session!" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getMyRegistrations = async (req, res) => {
    try {
        const sessions = await Session.find({ attendees: req.userId })
            .populate("expoId", "title date location")
            .sort({ startTime: 1 })
        return res.status(200).json({ success: true, data: sessions })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// ── Feedback ──────────────────────────────────────────────────────────────
export const submitFeedback = async (req, res) => {
    try {
        const { expoId, type, message } = req.body
        if (!message) return res.status(400).json({ success: false, message: "Message required" })
        await Feedback.create({ userId: req.userId, expoId, type, message })
        return res.status(201).json({ success: true, message: "Feedback submitted!" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getExhibitorDetail = async (req, res) => {
    try {
        const app = await Application.findById(req.params.applicationId)
            .populate("exhibitorId", "username email")
            .populate("boothId",     "boothNumber size position")
            .populate("expoId",      "title date location")

        if (!app) return res.status(404).json({ success: false, message: "Exhibitor not found" })

        const profile = await ExhibitorProfile.findOne({ userId: app.exhibitorId._id })

        return res.status(200).json({ success: true, data: { ...app.toObject(), profile } })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getChatContacts = async (req, res) => {
    try {
        const tickets = await Ticket.find({ userId: req.userId, status: 'confirmed' })
            .populate('expoId')

        const expoIds = [...new Set(
            tickets.map(t => t.expoId?._id?.toString()).filter(Boolean)
        )]

        const applications = await Application.find({
            expoId: { $in: expoIds },
            status: 'approved'
        })
            .populate('exhibitorId', 'username email')
            .populate('expoId', 'title date location')
            .populate('boothId', 'boothNumber position')

        const contacts = applications.map(a => ({
            _id: a.exhibitorId._id,
            username: a.exhibitorId.username,
            email: a.exhibitorId.email,

            // IMPORTANT: fix missing fields for frontend
            company: a.exhibitorId?.company || "",
            event: a.expoId ? {
                title: a.expoId.title,
                date: a.expoId.date,
                location: a.expoId.location
            } : null,
            booth: a.boothId ? {
                name: a.boothId.boothNumber,
                position: a.boothId.position
            } : null
        }))

        return res.status(200).json({ success: true, data: contacts })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const sendChatMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body
        if (!receiverId || !content)
            return res.status(400).json({ success: false, message: "Required fields missing" })

        const message = await Message.create({
            senderId: req.userId, receiverId, content
        })
        return res.status(201).json({ success: true, data: message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getChatMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.userId,        receiverId: req.params.userId },
                { senderId: req.params.userId, receiverId: req.userId }
            ]
        })
        .populate('senderId',   'username role')
        .populate('receiverId', 'username role')
        .sort({ createdAt: 1 })

        await Message.updateMany(
            { senderId: req.params.userId, receiverId: req.userId, isRead: false },
            { isRead: true }
        )
        return res.status(200).json({ success: true, data: messages })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}