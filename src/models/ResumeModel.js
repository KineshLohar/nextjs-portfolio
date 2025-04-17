import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    resumeId: {
        type: Number,
        default: 1
    },
    link: {
        type: String,
        required: true
    }
}, { timestamps: true })

const ResumeModel = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

export default ResumeModel;