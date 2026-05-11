import { Expo }     from "../models/expoModel.js"
import { Session }  from "../models/sessionModel.js"
import { Booth }    from "../models/boothModel.js"
import { Application } from "../models/applicationModel.js"
import { Feedback } from "../models/feedbackModel.js"
import { Ticket }   from "../models/ticketModel.js"
import { Bookmark } from "../models/bookmarkModel.js"

// ── Browse ────────────────────────────────────────────────────────────────
export const getPublishedExpos = async (req, res) => {
    try {
        const { type, city, category, search, dateFilter } = req.query

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

        if (dateFilter) {
            const now = new Date()

            if (dateFilter === "today") {
                const end = new Date()
                end.setHours(23, 59, 59, 999)
                filter.date = { $gte: now, $lte: end }
            }

            if (dateFilter === "week") {
                const end = new Date()
                end.setDate(end.getDate() + 7)
                filter.date = { $gte: now, $lte: end }
            }

            if (dateFilter === "month") {
                const end = new Date()
                end.setMonth(end.getMonth() + 1)
                filter.date = { $gte: now, $lte: end }
            }

            if (dateFilter === "3months") {
                const end = new Date()
                end.setMonth(end.getMonth() + 3)
                filter.date = { $gte: now, $lte: end }
            }
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
                { title:    new RegExp(q, "i") },
                { city:     new RegExp(q, "i") },
                { artist:   new RegExp(q, "i") },
                { team:     new RegExp(q, "i") },
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
        .populate("boothId",     "boothNumber position")
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
            userId:   req.userId,
            expoId,
            tierName,
            price:    tier.price * qty,
            quantity: qty,
            bookingRef,
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