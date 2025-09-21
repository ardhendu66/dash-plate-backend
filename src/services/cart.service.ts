import redis from "../config/redis";
import { Cart, CartItem } from "../dtos/cart.dto";
import { ActionNotAllowedError, ServiceNotFoundError, ServiceUnavailableError } from "../utils/GlobalError";

// redis: cart key for user
const cartKey = (userId: number) => `cart:${userId}`;

const cartService = {
    // Get the cart
    async getCart(userId: number): Promise<Cart | null> {
        const cart = await redis.get(cartKey(userId));
        return cart ? JSON.parse(cart) : null;
    },
    // Add item to the cart
    async addItem(
        userId: number,
        restaurantId: string,
        menuItemId: string,
        price: number,
        options?: { allowReplace?: boolean }
    ): Promise<Cart> {
        let cart = (await this.getCart(userId)) || {
            restaurantId, items: [], totalAmount: 0
        };
        // if switching restaurant reset cart
        if(cart.restaurantId !== restaurantId && cart.items.length > 0) {
            if(options?.allowReplace) {
                // reset the cart for new restaurant
                cart = {
                    restaurantId,
                    items: [],
                    totalAmount: 0
                }
            }
            else {
                throw new ActionNotAllowedError(
                    "Cart already contains items from another restaurant."
                );
            }
        }
        const existingItem = cart.items.find(item => item.menuItemId === menuItemId);
        // if so update the quantity
        if(existingItem) {
            existingItem.quantity += 1;
        }
        // else fresh item of new restaurant added to cart 
        else {
            cart.items.push({
                menuItemId, price, quantity: 1
            })
        }
        cart.totalAmount = cart.items.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
        )
        const saveToRedis = await redis.set(
            cartKey(userId), JSON.stringify(cart), "EX", 100 * 24 * 3600
        );
        if(saveToRedis !== "OK") {
            throw new ServiceUnavailableError("saving item to cart failed");
        }
        return cart;
    },
    // Update item quantity on cart
    async removeItem(userId: number, menuItemId: string): Promise<Cart | null> {
        const cart = await this.getCart(userId);
        if(!cart) {
            throw new ServiceNotFoundError(
                "After adding some item to cart, you can remove any item"
            );
        }
        const item = cart.items.find(item => {
            console.log({
                menuItemId,
                cartItemId: item.menuItemId,
            });            
            return item.menuItemId === menuItemId
        });
        if(!item) {
            throw new ServiceNotFoundError(
                "item you want to remove not found"
            );
        }
        item.quantity -= 1;
        if(item.quantity === 0) {
            cart.items = cart.items.filter(item => item.menuItemId !== menuItemId);
        }
        cart.totalAmount = cart.items.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
        );

        if(cart.items.length === 0) {
            await redis.del(cartKey(userId));
            return null;
        }

        await redis.set(cartKey(userId), JSON.stringify(cart), "EX", 100 * 24 * 3600);
        return cart;
    },
    // Clear the whole Cart
    async clearCart(userId: number): Promise<void> {
        await redis.del(cartKey(userId));
    },
}

export default cartService;