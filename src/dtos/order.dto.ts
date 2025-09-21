import { Order } from "../models/postgres/order.model";

interface OrderModelDto {
    createOrder: (order: Order) => Promise<Order>;
    findOrderById: (order_id: number) => Promise<Order | null>;
    findOrdersByUser: (user_id: number) => Promise<Order[]>;
    findRestaurantOrders: (restaurant_id: string) => Promise<Order[]>;
    updateOrderStatus: (order_id: number, order_status: string) => Promise<Order | null>;
    updatePaymentStatus: (order_id: number, payment_status: string) => Promise<Order | null>;
}

interface OrderCreationAttributes {
    restaurant_id: string;
    delivery_address: string;
}

export { OrderModelDto, OrderCreationAttributes };