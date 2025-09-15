import http from "http";
import { Server as SocketServer } from "socket.io";
import { connectMongo, pool } from "./config/db";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: "*",
        // methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    }
});

io.on("connection", (socket) => {
    console.log(`Client_${socket.id} connected`);

    socket.on("disconnect", () => {
        console.log(`Client_${socket.id} disconnected:`);
    });
})


// Start the server
async function startingOurServer() {
    try {
        // Postgres DB connection test
        await pool.query("SELECT NOW()");

        // MongoDB connection test
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

startingOurServer();