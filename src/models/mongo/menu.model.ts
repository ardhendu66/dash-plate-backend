import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
    restaurantId?: string;
    name: string;
    description?: string;
    price: number;
    category?: string;      // e.g., "Starters", "Main Course", "Desserts"
    imageUrl?: string;
    available: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const menuItemSchema: Schema = new Schema<IMenuItem>({
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
    },
}, 
{ 
    timestamps: true 
});

const MenuItem = mongoose.model<IMenuItem>("MenuItem", menuItemSchema);

export default MenuItem;