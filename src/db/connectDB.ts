import mongoose from "mongoose";

const connectDB = async () => {
    try {

        // if (mongoose.connection.readyState >= 1) {
        //     // Already connected or connecting
        //     return;
        // }
        mongoose.connect(process.env.MONGO_URI!, {
            dbName: "nextjs-portfolio",
        })
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("connected to database successfully")
        })

        connection.on('error', (error) => {
            console.log("error connecting database")
            console.log(error);
            process.exit()
        })
        
    } catch (error) {
        console.log("Error connecting to DB")
        console.log(error)
    }
}

export default connectDB;