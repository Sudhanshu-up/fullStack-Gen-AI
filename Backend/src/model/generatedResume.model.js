import mongoose from "mongoose"
import selfDescriptionSchema from "./subSchemas/selfDescription.schema.js"

const generatedResumeSchema = new mongoose.Schema({
    jobDescription: {
        type: String
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: selfDescriptionSchema
    },
    html: {
        type: String,
        required: [true, "Generated resume HTML is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    }
}, {
    timestamps: true
})

export const GeneratedResume = mongoose.model("GeneratedResume", generatedResumeSchema)