import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseConnection = () => {
    // Fail fast on disconnects instead of buffering requests indefinitely
    mongoose.set('bufferCommands', false);

    const mongoUri = process.env.MONOGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        console.warn("[AI Studio] MONOGO_URI or MONGODB_URI not provided. Database connection deferred.");
        return;
    }

    mongoose.connect(mongoUri)
        .then(() => {
            console.log("Connected to MongoDB successfully");
        })
        .catch((error) => {
            console.warn("MongoDB connection error — some features may not work:", error.message);
        });
};

export default databaseConnection;