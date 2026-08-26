import "dotenv/config";
import { connectDatabase } from "./config/database.js";
import app from "./app.js";
import { ENV } from "./config/env.js";

const PORT = ENV.PORT;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`AFTER API running on port http://localhost:${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error("Failed to start AFTER:", error);
    process.exit(1);
  });