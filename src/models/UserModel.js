const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
    email: {
        type: String,

    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User;