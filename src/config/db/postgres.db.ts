import { Pool } from "pg";
import dotenv from "dotenv";
import { ServiceUnavailableError } from "../../utils/GlobalError";
dotenv.config();

const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const connectPostgres = async () => {
    try {
        const client = await pool.connect();
        await client.query("SELECT NOW()");
        console.log("✅ PostgreSQL connection established");
        client.release();
    }
    catch(err: any) {
        console.error("❌ PostgreSQL connection error:", err.message);
        throw new ServiceUnavailableError(err.message);
    }
}

// Log errors without crashing the server
pool.on("error", (err) => {
    console.error("❌ Unexpected PostgreSQL error:", err.message);
});

export { pool, connectPostgres };