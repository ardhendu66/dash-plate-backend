import { Pool } from "pg";
import dotenv from "dotenv";
import { ServiceUnavailableError } from "../../utils/GlobalError";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL, });

// Postgres Connection set-up
// pool.on("connect", async () => {
//     await pool.query("SELECT NOW()");
//     console.log("✅ Connected to PostgreSQL database");
// });

// pool.on("error", (err) => {
//     console.error("❌ PostgreSQL connection error:", err);
//     throw new ServiceUnavailableError(
//         "Trouble connecting to our postgres. Please try again in a moment."
//     );
// });

const connectPostgres = async () => {
    try {
        await pool.connect();
        console.log("✅ PostgreSQL connection established");
    }
    catch (err) {
        console.error("❌ PostgreSQL connection error:", err);
        throw new ServiceUnavailableError(
            "We're having trouble connecting to our postgres. Please try again in a moment."
        );
    }
}

export { pool, connectPostgres };