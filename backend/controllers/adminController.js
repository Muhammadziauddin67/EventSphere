import { Expo } from "../models/expoModel.js"
import { Booth } from "../models/boothModel.js"
import { Application } from "../models/applicationModel.js"
import { Session } from "../models/sessionModel.js"
import { Analytics } from "../models/analyticsModel.js"
import { Message } from "../models/messageModel.js"
import { Feedback } from "../models/feedbackModel.js"
import { ExhibitorProfile } from "../models/exhibitorProfileManagement.js"
import { User } from "../models/userModels.js"
import { Testimonial } from "../models/testimonialModel.js"
import mongoose from "mongoose"

export const createExpo = async (req, res) => {
    try {
        const expo = await Expo.create({ ...req.body, createdBy: req.userId })
        return res.status(201).json({ success: true, message: "Expo created", data: expo })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getExpos = async (req, res) => {
    try {
        const expos = await Expo.find().sort({ createdAt: -1 })
        return res.status(200).json({ success: true, data: expos })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateExpo = async (req, res) => {
    try {
        const expo = await Expo.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!expo) return res.status(404).json({ success: false, message: "Expo not found" })
        return res.status(200).json({ success: true, message: "Expo updated", data: expo })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteExpo = async (req, res) => {
    try {
        await Expo.findByIdAndDelete(req.params.id)
        return res.status(200).json({ success: true, message: "Expo deleted" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("exhibitorId", "username email")
            .populate("expoId", "title")
            .populate("boothId", "boothNumber status expoId")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            data: applications
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body  // "approved" or "rejected"
        const application = await Application.findByIdAndUpdate(
            req.params.id, { status }, { new: true }
        )
        if (!application) return res.status(404).json({ success: false, message: "Application not found" })
        return res.status(200).json({ success: true, message: `Application ${status}`, data: application })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const assignBooth = async (req, res) => {
    try {
        const { boothId } = req.body

        const application = await Application.findById(req.params.id)
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            })
        }

        const booth = await Booth.findById(boothId)
        if (!booth) {
            return res.status(404).json({
                success: false,
                message: "Booth not found"
            })
        }

        if (booth.status !== "available") {
            return res.status(400).json({
                success: false,
                message: "Booth already occupied"
            })
        }

        // ==============================
        // 1. FREE OLD BOOTH (IMPORTANT)
        // ==============================
        if (application.boothId) {
            await Booth.findByIdAndUpdate(application.boothId, {
                assignedTo: null,
                status: "available"
            })
        }

        // ==============================
        // 2. ASSIGN NEW BOOTH
        // ==============================
        booth.assignedTo = application.exhibitorId
        booth.status = "occupied"
        await booth.save()

        // ==============================
        // 3. UPDATE APPLICATION
        // ==============================
        application.boothId = booth._id
        await application.save()

        return res.status(200).json({
            success: true,
            message: "Booth assigned successfully",
            data: {
                boothId: booth._id,
                applicationId: application._id
            }
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const createSession = async (req, res) => {
    try {
        const { expoId, title, speaker, topic, location, startTime, endTime, capacity } = req.body
        if (!expoId || !title || !startTime || !endTime)
            return res.status(400).json({ success: false, message: "Required fields missing" })

        const session = await Session.create({
            expoId, title, speaker, topic, location, startTime, endTime, capacity
        })
        return res.status(201).json({ success: true, message: "Session created", data: session })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// GET ALL SESSIONS FOR AN EXPO
export const getSessions = async (req, res) => {
    try {
        const { expoId } = req.params
        const sessions = await Session.find({ expoId }).sort({ startTime: 1 })
        return res.status(200).json({ success: true, data: sessions })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// UPDATE SESSION
export const updateSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!session) return res.status(404).json({ success: false, message: "Session not found" })
        return res.status(200).json({ success: true, message: "Session updated", data: session })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// DELETE SESSION
export const deleteSession = async (req, res) => {
    try {
        const { id } = req.params

        // 1. Validate ID (THIS FIXES MOST 500 ERRORS)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid session ID"
            })
        }

        // 2. Check if session exists
        const session = await Session.findById(id)

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            })
        }

        // 3. Delete safely
        await Session.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "Session deleted successfully"
        })

    } catch (error) {
        console.error("DELETE SESSION ERROR:", error)

        return res.status(500).json({
            success: false,
            message: "Server error while deleting session"
        })
    }
}

export const getAnalytics = async (req, res) => {
    try {
        const { expoId } = req.params

        const [
            totalAttendees,
            totalExhibitors,
            totalSessions,
            pendingApplications,
            approvedApplications,
            rejectedApplications,
            booths,
            sessions,
        ] = await Promise.all([
            // count unique attendees registered for sessions in this expo
            Session.distinct("attendees", { expoId }),
            // count approved exhibitor applications
            Application.countDocuments({ expoId, status: "approved" }),
            // count sessions
            Session.countDocuments({ expoId }),
            // application status breakdown
            Application.countDocuments({ expoId, status: "pending" }),
            Application.countDocuments({ expoId, status: "approved" }),
            Application.countDocuments({ expoId, status: "rejected" }),
            // booth occupancy
            Booth.find({ expoId }),
            // session popularity (by attendee count)
            Session.find({ expoId }).select("title attendees"),
        ])

        const boothStats = {
            total: booths.length,
            available: booths.filter(b => b.status === "available").length,
            reserved: booths.filter(b => b.status === "reserved").length,
            occupied: booths.filter(b => b.status === "occupied").length,
        }

        const sessionPopularity = sessions.map(s => ({
            title: s.title,
            registrations: s.attendees.length,
        })).sort((a, b) => b.registrations - a.registrations)

        return res.status(200).json({
            success: true,
            data: {
                totalAttendees: totalAttendees.length,
                totalExhibitors: totalExhibitors,
                totalSessions: totalSessions,
                applications: {
                    pending: pendingApplications,
                    approved: approvedApplications,
                    rejected: rejectedApplications,
                },
                boothStats,
                sessionPopularity,
            }
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Admin generates booths for an expo (like setting up the floor)
export const generateBooths = async (req, res) => {
    try {
        const { expoId, rows, cols } = req.body
        // e.g. rows=5, cols=8 = 40 booths

        const booths = []
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                booths.push({
                    expoId,
                    boothNumber: `${String.fromCharCode(65 + r)}${c + 1}`, // A1, A2, B1...
                    status: 'available',
                    position: { x: c, y: r }
                })
            }
        }

        await Booth.deleteMany({ expoId }) // clear old booths
        await Booth.insertMany(booths)
        return res.status(201).json({ success: true, message: 'Floor plan generated' })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Get all booths for an expo
export const getBooths = async (req, res) => {
    try {
        const booths = await Booth.find({ expoId: req.params.expoId })
            .populate('assignedTo', 'username email')
        return res.status(200).json({ success: true, data: booths })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getAdminMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ senderId: req.userId }, { receiverId: req.userId }]
        })
            .populate("senderId", "username email role")
            .populate("receiverId", "username email role")
            .sort({ createdAt: -1 })
        return res.status(200).json({ success: true, data: messages })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getAdminConversation = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.userId, receiverId: req.params.userId },
                { senderId: req.params.userId, receiverId: req.userId }
            ]
        })
            .populate("senderId", "username role")
            .populate("receiverId", "username role")
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

export const sendAdminMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body
        if (!receiverId || !content)
            return res.status(400).json({ success: false, message: "Receiver and content required" })
        const message = await Message.create({
            senderId: req.userId, receiverId, content
        })
        return res.status(201).json({ success: true, data: message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate("userId", "username email")
            .populate("expoId", "title")
            .sort({ createdAt: -1 })
        return res.status(200).json({ success: true, data: feedback })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const respondToFeedback = async (req, res) => {
    try {
        const { status, response } = req.body
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status, response },
            { new: true }
        )
        if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" })
        return res.status(200).json({ success: true, message: "Feedback updated", data: feedback })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -otp -otpExpiry -token')
            .sort({ createdAt: -1 })
        return res.status(200).json({ success: true, data: users })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body
        const user = await User.findByIdAndUpdate(
            req.params.id, { role }, { new: true }
        ).select('-password')
        if (!user) return res.status(404).json({ success: false, message: "User not found" })
        return res.status(200).json({ success: true, message: "Role updated", data: user })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.userId.toString())
            return res.status(400).json({ success: false, message: "Cannot delete yourself" })
        await User.findByIdAndDelete(req.params.id)
        return res.status(200).json({ success: true, message: "User deleted" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getExhibitorProfiles = async (req, res) => {
    try {
        const profiles = await ExhibitorProfile.find()
            .populate("userId", "username email")
        return res.status(200).json({ success: true, data: profiles })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateExhibitorProfile = async (req, res) => {
    try {
        const profile = await ExhibitorProfile.findOneAndUpdate(
            { userId: req.params.userId },
            { ...req.body },
            { new: true, upsert: true }
        )
        return res.status(200).json({ success: true, message: "Profile updated", data: profile })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find()
            .populate("userId", "username email")
            .sort({ createdAt: -1 })
        return res.status(200).json({ success: true, data: testimonials })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        )
        return res.status(200).json({ success: true, message: "Updated", data: testimonial })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteTestimonial = async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id)
        return res.status(200).json({ success: true, message: "Deleted" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}