import mongoose from "mongoose"
import selfDescriptionSchema from "./subSchemas/selfDescription.schema.js"

const technicalQuestionSchema = new mongoose.Schema({
    question: { type: String },
    intention: { type: String },
    shortAns: { type: String }
}, { _id: false })

const behavioralQuestionSchema = new mongoose.Schema({
    question: { type: String },
    intention: { type: String },
    shortAns: { type: String }
}, { _id: false })

const skillGapSchema = new mongoose.Schema({
    skill: { type: String },
    severity: {
        type: String,
        enum: ["low", "medium", "high"]
    }
}, { _id: false })

const preparationPlanSchema = new mongoose.Schema({
    day: { type: Number },
    focus: { type: String },
    tasks: { type: [String] }
}, { _id: false })

const userReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: selfDescriptionSchema
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGap: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    }
}, {
    timestamps: true
})

export const UserReport = mongoose.model("UserReport", userReportSchema)