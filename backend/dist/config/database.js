import mongoose from "mongoose";
import { ENV } from "./env.js";
export const connectDatabase = () => {
    const uri = ENV.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not defined");
    }
    return mongoose.connect(uri)
        .then(() => {
        console.log("Connected to MongoDB");
    })
        .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    });
};
//# sourceMappingURL=database.js.map