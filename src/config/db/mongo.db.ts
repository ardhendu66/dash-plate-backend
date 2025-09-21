import mongoose from "mongoose";
import dotenv from "dotenv";
import { ServiceUnavailableError } from "../../utils/GlobalError";
import RestaurantModel, { restaurantSchema } from "../../models/mongo/restaurant.model";
dotenv.config();

// MongoDB Connection set-up
const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("✅ mongoDB connection established");

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

export default connectMongo;