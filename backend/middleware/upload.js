import multer from "multer"
import path   from "path"

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/
        if (allowed.test(path.extname(file.originalname).toLowerCase()))
            cb(null, true)
        else
            cb(new Error('Only images allowed'))
    }
})