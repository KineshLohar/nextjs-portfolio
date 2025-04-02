const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
    email: {
        type: String,

    },
    password: {
        type: String,
        required: true
    },
})

const User = mongoose.model.User || mongoose.model("User", userSchema)

export default User;