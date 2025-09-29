import http from "http";
import dotenv from "dotenv";
import { connectPostgres } from "./config/db/postgres.db";
import connectMongo from "./config/db/mongo.db";
import app from "./app";
import { initSocket } from "./socket";

dotenv.config();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

// Start the server
async function main() {
    try {
        await connectPostgres();
        await connectMongo();
        server.listen(port, () => {
            console.log(`🚀 Server running... http://localhost:${port}`);
        });
    } 
    catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
}

main();