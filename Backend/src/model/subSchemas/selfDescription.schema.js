import mongoose from "mongoose"

const selfDescriptionSchema = new mongoose.Schema({
    skills: { type: [String], default: [] },
    experience: { type: String },
    projectLinks: { type: [String], default: [] },
    additionalInfo: { type: String }
}, { _id: false })

export default selfDescriptionSchema