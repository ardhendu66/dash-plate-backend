import { pool } from "../../config/db/postgres.db";
import { OrderModelDto } from "../../dtos/order.dto";
import { CartItem } from "../../dtos/cart.dto";

interface Order {
    id?: number,
    user_id: number,
    restaurant_id: string,
    items: CartItem[],
    total_amount: number,
    payment_status: 'PENDING' | 'PAID' | 'FAILED',
    order_status: "PLACED" | "ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED",
    delivery_address: string,
    created_at?: Date,
    updated_at?: Date,
}

const OrderModel: OrderModelDto = {
    // find Order by id
    async findOrderById(order_id: number): Promise<Order | null> {
        const query = `SELECT * FROM orders WHERE id = $1`;
        const result = await pool.query(query, [order_id]);
        return result.rows[0] || null;
    },
    // find all orders of a user
    async findOrdersByUser(user_id: number): Promise<Order[]> {
        const query = `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`;
        const result = await pool.query(query, [user_id]);
        return result.rows;
    },
    // create a order of a user
    async createOrder(order: Order): Promise<Order> {
        const query = `INSERT INTO orders (user_id, restaurant_id, items, total_amount, payment_status, order_status, delivery_address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

        const result = await pool.query(query, [
            order.user_id, order.restaurant_id, JSON.stringify(order.items), 
            order.total_amount, order.payment_status || 'PENDING', 
            order.order_status || 'PLACED', order.delivery_address
        ]);
        return result.rows[0];
    },
    // find Restaurant orders
    async findRestaurantOrders(restaurant_id: string): Promise<Order[]> {
        const query = `SELECT * FROM orders WHERE restaurant_id = $1 ORDER BY created_at DESC`;
        return (await pool.query(query, [restaurant_id])).rows;
    },
    // update order status
    async updateOrderStatus(order_id: number, order_status: string): Promise<Order | null> {
        const query = `UPDATE orders SET order_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;

        const result = await pool.query(query, [order_status, order_id]);
        return result.rows[0] || null;
    },
    // update payment status
    async updatePaymentStatus(order_id: number, payment_status: string): Promise<Order | null> {
        const query = `UPDATE orders SET payment_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`;

        const result = await pool.query(query, [payment_status, order_id]);
        return result.rows[0] || null;
    },
};

export { Order, OrderModel };