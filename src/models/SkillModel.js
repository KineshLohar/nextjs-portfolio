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
    }
})

const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema)

export default Skill