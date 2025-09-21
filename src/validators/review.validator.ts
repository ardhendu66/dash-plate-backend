import { z } from "zod";

const createReviewSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),
  userId: z.string().min(1, "User ID is required"), // Postgres ID reference
  rating: z.number().min(1).max(5),
  comment: z.string().max(500, "Comment too long").optional(),
});

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().max(500).optional(),
});

export { createReviewSchema, updateReviewSchema };