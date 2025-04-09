import mongoose from 'mongoose'

const workExperienceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: ''
    },
    techs: {
        type: String,
        required: true
    },
    descriptions: [
        {
            text: {
                type: String
            },
        }
    ],
    currentlyWorking: {
        type: Boolean
    },
    startDate: {
        type: Date,
        required: [true, "Start Date is required"]
    },
    endDate: {
        type: Date
    }
}, { timestamps: true })

export const WorkExperience = mongoose.models.WorkExperience || mongoose.model("WorkExperience", workExperienceSchema)

