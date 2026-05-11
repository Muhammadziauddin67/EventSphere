export const isExhibitor = (req, res, next) => {
    if (req.user.role !== "exhibitor") {
        return res.status(403).json({ success: false, message: "Access denied. Exhibitors only." })
    }
    next()
}