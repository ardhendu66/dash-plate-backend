import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
    name: string;
    description?: string;
    address: string;
    cuisine: string[];
    rating: number;
    imageUrl?: string;
    ownerId: number; // vendor user.id from Postgres
    isOpen?: boolean;
    openingHours?: {
        open: string;
        close: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export const restaurantSchema: Schema = new Schema<IRestaurant>({
    name: { 
        type: String, 
        required: true, 
        trim: true,
        // unique: true,
    },
    description: { 
        type: String, 
        trim: true,
    },
    address: { 
        type: String, 
        required: true,
        trim: true
    },
    cuisine: { 
        type: [String], 
        required: true 
    },
    rating: { 
        type: Number, 
        default: 0, 
        min: 0, 
        max: 5 
    },
    imageUrl: { 
        type: String 
    },
    ownerId: { 
        type: Number, 
        required: true,
        // unique: true,
    },
    isOpen: { 
        type: Boolean, 
        default: true 
    },
    openingHours: {
        open: String,
        close: String,
    },
}, 
{ 
    timestamps: true 
});

const RestaurantModel = mongoose.models?.Restaurant || mongoose.model<IRestaurant>("Restaurant", restaurantSchema);

export default RestaurantModel;