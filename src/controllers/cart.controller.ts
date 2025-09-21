import { Request, Response } from "express";
import cartService from "../services/cart.service";
import { catchAsync } from "../utils/catchAsync";
import { UnauthorizedError } from "../utils/GlobalError";

const getCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const cart = await cartService.getCart(userId);
    return res.status(200).json({
        cart,
        message: cart ? undefined : "Cart is empty",
    });
});

const addItem = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { restaurantId, menuItemId } = req.params;
    const { price } = req.query;
    if(typeof price !== "string") {
        console.log("Please ensure you entered correct price query format");        
        throw new UnauthorizedError("Please ensure you entered correct price query format");
    }
    const cart = await cartService.addItem(userId, restaurantId, menuItemId, Number(price));
    return res.status(201).json({
        cart, message: "Item added to Cart"
    });
});

const removeItem = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { menuItemId } = req.params;
    const cart = await cartService.removeItem(userId, menuItemId);
    return res.status(202).json({
        cart, message: cart ? "Item removed from Cart" : "Cart is Empty"
    });
});

const clearCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    await cartService.clearCart(userId);
    return res.status(202).json({ message: "Cart cleared successfully" });
});

export { getCart, addItem, removeItem, clearCart };