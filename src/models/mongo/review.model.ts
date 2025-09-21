import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    restaurantId?: string;
    userId?: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema: Schema = new Schema<IReview>({
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User", // ⚠️ Note: This will only work if you mirror some user IDs in Mongo or use a hybrid approach
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
}, { 
    timestamps: true 
});

// ✅ Optional: prevent duplicate reviews (same user reviewing same restaurant multiple times)
reviewSchema.index({ restaurantId: 1, userId: 1 }, { unique: true });

const ReviewModel = mongoose.model<IReview>("Review", reviewSchema);

export default ReviewModel;