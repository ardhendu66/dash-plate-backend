import { z } from "zod";

const createMenuItemSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),
  name: z.string().min(2, "Menu item must have a name"),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().optional(),
  imageUrl: z.string().url().optional(),
  available: z.boolean().default(true),
});

const updateMenuItemSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category: z.string().optional(),
  imageUrl: z.string().url().optional(),
  available: z.boolean().optional(),
});

export { createMenuItemSchema, updateMenuItemSchema };