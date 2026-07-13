import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// temp folder — Cloudinary pe upload hone tak file yahan rukegi, phir delete ho jayegi
const tempDir = path.join(__dirname, "..", "..", "temp")

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir)
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowed for avatar upload"), false)
    }
}

const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
})

export default uploadAvatar