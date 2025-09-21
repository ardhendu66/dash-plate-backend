import redis from "../config/redis";
import { Order, OrderModel } from "../models/postgres/order.model";
import { createOrderSchema, OrderItemDto } from "../validators/order.validator";
import { ServiceNotFoundError } from "../utils/GlobalError";
import { restaurantService } from "./restaurant.service";

const cartKey = (user_id: number) => `cart:${user_id}`;

const orderService = {
    async checkout(user_id: number, reqBody: OrderItemDto): Promise<Order> {
        const validatedData = createOrderSchema.parse(reqBody);
        const cartData = await redis.get(cartKey(user_id));
        if(!cartData) {
            throw new ServiceNotFoundError("Cart is empty, add item to cart.");
        }
        const cart = JSON.parse(cartData);
        const restaurant = await restaurantService.getRestaurantById(
            validatedData.restaurant_id
        );
        if(!restaurant) {
            throw new ServiceNotFoundError("Provide correct restaurant details");
        }
        let total_amount = 0;
        for(const item of cart.items) {
            total_amount += item.price * item.quantity;
        }
        const newOrder = OrderModel.createOrder({
            user_id,
            restaurant_id: validatedData.restaurant_id,
            items: cart.items,
            total_amount,
            payment_status: 'PENDING',
            order_status: 'PLACED',
            delivery_address: validatedData.delivery_address,
        });
        await redis.del(cartKey(user_id));
        return newOrder;
    }
}

export default orderService;