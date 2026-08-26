import dotenv from "dotenv";
dotenv.config();
export const ENV = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/after",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
};
//# sourceMappingURL=env.js.map