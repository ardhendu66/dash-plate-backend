import redis from "../config/redis";
import { Order, OrderModel } from "../models/postgres/order.model";
import { ServiceNotFoundError } from "../utils/GlobalError";
import { restaurantService } from "./restaurant.service";
import { OrderCreationAttributes } from "../dtos/order.dto";
import { getIo } from "../socket";

const cartKey = (user_id: number) => `cart:${user_id}`;

const orderService = {
    checkout: (
        async (user_id: number, order_details: OrderCreationAttributes): Promise<Order> => 
        {
            console.log(order_details);
            const cartData = await redis.get(cartKey(user_id));
            if(!cartData) {
                throw new ServiceNotFoundError("Cart is empty, add item to cart.");
            }
            const cart = JSON.parse(cartData);
            const restaurant = await restaurantService.getRestaurantById(order_details.restaurant_id);
            if(!restaurant) {
                throw new ServiceNotFoundError("Provide correct restaurant details");
            }
            let total_amount = 0;
            for(const item of cart.items) {
                total_amount += item.price * item.quantity;
            }
            const newOrder = OrderModel.createOrder({
                user_id,
                restaurant_id: order_details.restaurant_id,
                items: cart.items,
                total_amount,
                payment_status: 'PENDING',
                order_status: 'PLACED',
                delivery_address: order_details.delivery_address,
            });
            await redis.del(cartKey(user_id));
            return newOrder;
        }
    ),
    // find all orders of a user
    getAllOrdersOfUser: async (user_id: number): Promise<Order[] | null> => {
        return await OrderModel.findOrdersByUser(user_id);
    },
    // find order by id
    getSingleOrder: async (order_id: number): Promise<Order | null> => {
        return await OrderModel.findOrderById(order_id);
    },
    // find all orders of a restaurant
    getAllOrdersOfRestaurants: async (restaurant_id: string): Promise<Order[] | null> => {
        return await OrderModel.findRestaurantOrders(restaurant_id);
    },
    // update order status
    updateStatusOfAOrder: (
        async (order_id: number, order_status: string): Promise<Order | null> => 
        {
            const order = await OrderModel.updateOrderStatus(order_id, order_status);
            if(!order) {
                throw new ServiceNotFoundError("Order not found");
            }
            getIo().to(String(order_id)).emit("order_status", {
                order_id: order.id,
                status: order.order_status,
                updated_at: new Date(),
            });
            return order;
        }
    ),
    // update payment status
    updatePaymentStatusOfAOrder: (
        async (order_id: number, payment_status: string): Promise<Order | null> => 
        {
            return await OrderModel.updatePaymentStatus(order_id, payment_status);
        }
    ),
}

export default orderService;