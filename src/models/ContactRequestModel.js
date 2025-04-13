const { default: mongoose } = require("mongoose");


const contactRequestSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, { timestamps: true })

const ContactRequest = mongoose.models.ContactRequest || mongoose.model('ContactRequest', contactRequestSchema)

export default ContactRequest;