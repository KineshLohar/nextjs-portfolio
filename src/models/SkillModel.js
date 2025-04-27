import mongoose from 'mongoose';
import { taskBasedCategories } from '../constants/constants'
const skillSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    type: {
        type: String,
        enum: taskBasedCategories,
        required: true
    },
    experience: {
        type: String
    },
    projects: {
        type: String
    },
    description: {
        type: String
    },
    logo:{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
}, { timestamps: true })

const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema)

export default Skill