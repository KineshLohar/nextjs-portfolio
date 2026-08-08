import mongoose from 'mongoose';

import { educationOrCertification } from '../constants/constants'

const eduCertSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: educationOrCertification,
        required: true
    },
    link: {
        type: String
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
}, { timestamps: true })

const EduCert = mongoose.models.EduCert || mongoose.model("EduCert", eduCertSchema)

export default EduCert;