import { Order } from "../models/postgres/order.model";
import z from "zod";
import { createOrderSchema } from "../validators/order.validator";
import { CartItem } from "./cart.dto";

interface OrderModelDto {
    createOrder: (order: Order) => Promise<Order>;
    findOrderById: (order_id: number) => Promise<Order | null>;
    findOrdersByUser: (user_id: number) => Promise<Order[]>;
    updateOrderStatus: (order_id: number, order_status: string) => Promise<Order | null>;
    updatePaymentStatus: (order_id: number, payment_status: string) => Promise<Order | null>;
}

export { OrderModelDto };