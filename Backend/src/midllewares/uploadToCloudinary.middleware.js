import fs from "fs"
import cloudinary from "../config/cloudinary.config.js"

/**
 * multer se temp folder mein file save hoti hai (req.file.path).
 * Ye middleware usse Cloudinary pe upload karta hai, req.file.cloudinaryUrl
 * mein URL set karta hai, aur local temp file delete kar deta hai.
 * Agar file hi nahi hai (avatar optional tha), toh seedha next() call ho jata hai.
 */
async function uploadToCloudinary(req, res, next) {
    if (!req.file) {
        return next()
    }

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "resume-ai/avatars"
        })

        req.file.cloudinaryUrl = result.secure_url

        // local temp file ab zaroorat nahi — delete kar do
        fs.unlink(req.file.path, (err) => {
            if (err) console.log("Failed to delete temp file:", err)
        })

        next()
    } catch (error) {
        // upload fail hone pe bhi temp file cleanup karo
        fs.unlink(req.file.path, () => {})

        return res.status(500).json({
            message: "Failed to upload avatar to Cloudinary"
        })
    }
}

export default uploadToCloudinary