import { Application }      from "../models/applicationModel.js"
import { Expo }             from "../models/expoModel.js"
import { Booth }            from "../models/boothModel.js"
import { ExhibitorProfile } from "../models/exhibitorProfileManagement.js"
import { Message }          from "../models/messageModel.js"
import { User }             from "../models/userModels.js"

// ── Expos ──────────────────────────────────────────────────────────────────
export const getAvailableExpos = async (req, res) => {
    try {
        const expos = await Expo.find({ status: "published" }).sort({ date: 1 })
        return res.status(200).json({ success: true, data: expos })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// ── Applications ───────────────────────────────────────────────────────────
export const applyForExpo = async (req, res) => {
    try {
        const { expoId, company, description, products, boothId } = req.body
        if (!expoId || !company)
            return res.status(400).json({ success: false, message: "Expo and company name are required" })

        const existing = await Application.findOne({ expoId, exhibitorId: req.userId })
        if (existing)
            return res.status(400).json({ success: false, message: "You already applied for this expo" })

        const application = await Application.create({
            expoId, company, description, products,
            exhibitorId: req.userId,
            boothId: boothId || null,
            status: "pending"
        })

        // mark booth as reserved if selected
        if (boothId) {
            await Booth.findByIdAndUpdate(boothId, { status: "reserved", assignedTo: req.userId })
        }

        return res.status(201).json({ success: true, message: "Application submitted successfully", data: application })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ exhibitorId: req.userId })
            .populate("expoId", "title date location status")
            .populate("boothId", "boothNumber status")
            .sort({ createdAt: -1 })
        return res.status(200).json({ success: true, data: applications })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// ── Profile ────────────────────────────────────────────────────────────────
export const getMyProfile = async (req, res) => {
    try {
        let profile = await ExhibitorProfile.findOne({ userId: req.userId })
        if (!profile) profile = await ExhibitorProfile.create({ userId: req.userId, company: req.user.username })
        return res.status(200).json({ success: true, data: profile })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const profile = await ExhibitorProfile.findOneAndUpdate(
            { userId: req.userId },
            { ...req.body },
            { new: true, upsert: true }
        )
        return res.status(200).json({ success: true, message: "Profile updated", data: profile })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// ── Booth ──────────────────────────────────────────────────────────────────
export const getMyBooth = async (req, res) => {
    try {
        const booth = await Booth.findOne({ expoId: req.params.expoId, assignedTo: req.userId })
        return res.status(200).json({ success: true, data: booth })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateBoothDetails = async (req, res) => {
    try {
        const booth = await Booth.findOneAndUpdate(
            { _id: req.params.boothId, assignedTo: req.userId },
            { products: req.body.products, staffInfo: req.body.staffInfo },
            { new: true }
        )
        if (!booth) return res.status(404).json({ success: false, message: "Booth not found" })
        return res.status(200).json({ success: true, message: "Booth updated", data: booth })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// ── Messaging ──────────────────────────────────────────────────────────────
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, expoId } = req.body
        if (!receiverId || !content)
            return res.status(400).json({ success: false, message: "Receiver and content are required" })

        const message = await Message.create({
            senderId: req.userId, receiverId, content, expoId: expoId || null
        })
        return res.status(201).json({ success: true, message: "Message sent", data: message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getMyMessages = async (req, res) => {
    try {
        // get list of unique conversations
        const messages = await Message.find({
            $or: [{ senderId: req.userId }, { receiverId: req.userId }]
        })
        .populate("senderId",   "username email role")
        .populate("receiverId", "username email role")
        .sort({ createdAt: -1 })
        return res.status(200).json({ success: true, data: messages })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getConversation = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.userId,       receiverId: req.params.userId },
                { senderId: req.params.userId, receiverId: req.userId }
            ]
        })
        .populate("senderId",   "username role")
        .populate("receiverId", "username role")
        .sort({ createdAt: 1 })

        // mark as read
        await Message.updateMany(
            { senderId: req.params.userId, receiverId: req.userId, isRead: false },
            { isRead: true }
        )
        return res.status(200).json({ success: true, data: messages })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getContacts = async (req, res) => {
    try {
        // exhibitors can message admins and other exhibitors
        const users = await User.find({
            _id: { $ne: req.userId },
            role: { $in: ["admin", "exhibitor"] }
        }).select("username email role")
        return res.status(200).json({ success: true, data: users })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}



export const getExpoBooths = async (req, res) => {
    try {
        const booths = await Booth.find({ expoId: req.params.expoId })
            .populate('assignedTo', 'username email')
        return res.status(200).json({ success: true, data: booths })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const uploadLogo = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ success: false, message: "No file uploaded" })

        const logoUrl = `http://localhost:8000/uploads/${req.file.filename}`
        await ExhibitorProfile.findOneAndUpdate(
            { userId: req.userId },
            { logo: logoUrl },
            { upsert: true, new: true }
        )
        return res.status(200).json({ success: true, message: "Logo uploaded", logo: logoUrl })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}