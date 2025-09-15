import { Pool } from "pg";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { ServiceUnavailableError } from "../utils/GlobalError";
import RestaurantModel from "../models/mongo/restaurant.model";
import { restaurantSchema } from "../models/mongo/restaurant.model";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL, });

pool.on("connect", () => {
    console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
    console.error("❌ PostgreSQL connection error:", err);
    throw new ServiceUnavailableError(
        "Trouble connecting to our postgres. Please try again in a moment."
    );
});


// MongoDB Connection Setup
const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("✅ Connected to MongoDB");

        // Restaurant Schema Indexes
        // let i1, i2, i3;
        // i1 = restaurantSchema.index({ name: "text", description: "text", cuisine: "text" }, {
        //     weights: { name: 10, cuisine: 6, description: 3 },
        //     name: "TextIndex_Restaurant"
        // });

        // i2 = restaurantSchema.index({ name: 1 }, { unique: true });
        // i3 = restaurantSchema.index({ ownerId: 1 }, { unique: true });

        // await RestaurantModel.syncIndexes();

        // (i1 && i2 && i3) ? console.log("Index works") : console.log("Index doesn't works");
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw new ServiceUnavailableError(
            "We're having trouble connecting to our mongoDB. Please try again in a moment."
        );
    }
}

export { connectMongo, pool };