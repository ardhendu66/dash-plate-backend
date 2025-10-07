import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

const redis = new Redis({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    password: REDIS_PASSWORD,
    maxRetriesPerRequest: null,
});

redis.on("connect", () => {
    console.log("✅ Redis connected successfully.");    
});

redis.on("error", (err) => {
    console.error("❌ Redis connection error: ", err.message);    
})

export default redis;