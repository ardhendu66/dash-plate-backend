import { z } from "zod";

const createRestaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  description: z.string().optional(),
  cuisine: z.array(z.string()).nonempty("At least one cuisine is required"),
});

const updateRestaurantSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  cuisine: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
});

export { createRestaurantSchema, updateRestaurantSchema };