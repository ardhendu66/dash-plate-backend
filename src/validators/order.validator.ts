import z from "zod";

const createOrderSchema = z.object({
    user_id: z.number(),
    restaurant_id: z.string().length(24, "Invalid restaurant ObjectId"),
    items: z.array(
        z.object({
            menuItemId: z.string().length(24, "Invalid menuItem ObjectId"),
            price: z.number().positive().max(5000),
            quantity: z.number().min(1).max(20),
        })
    ).nullable().optional(), // allows null OR undefined
    total_amount: z.number().positive().max(20000),
    payment_status: z.enum(["PENDING", "PAID", "FAILED"]), // match Postgres ENUM
    order_status: z.enum(["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"]),
    delivery_address: z.string().min(7, "Must be at least 7 characters long"),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});

const updateOrderStatusSchema = z.object({
    order_status: z.enum([
        'PLACED', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED',
    ]),
});

const updatePaymentStatusSchema = z.object({
    payment_staus: z.enum([
        'PENDING', 'PAID', 'FAILED',
    ]),
});

type OrderItemDto = z.infer<typeof createOrderSchema>;

export { 
    createOrderSchema, OrderItemDto,
    updateOrderStatusSchema, 
    updatePaymentStatusSchema 
};