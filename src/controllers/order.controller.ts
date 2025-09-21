import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import orderService from "../services/order.service";

const placeOrder = catchAsync(async (req: Request, res: Response) => {
    console.log(`POST /api/v1/order/place`);
    const userId = req.user!.id;
    const order = await orderService.checkout(userId, req.body);
    return res.status(201).json({
        order, message: "Order placed!"
    });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    console.log(`GET /api/v1/order`);    
    const userId = req.user!.id;
    const orders = await orderService.getAllOrdersOfUser(userId);
    return res.status(200).json({ orders });
});

const getRestaurantOrders = catchAsync(async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    console.log(`GET /api/v1/order/${restaurantId}`); 
    const orders = await orderService.getAllOrdersOfRestaurants(restaurantId);
    return res.status(200).json({ orders });
});

const changeOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    console.log(`PUT /api/v1/order/${orderId}`);
    const { status } = req.query;
    const updatedOrder = await orderService.updateStatusOfAOrder(Number(orderId), String(status));
    return res.status(202).json({ 
        order: updatedOrder, message: "Order_Status updated!" 
    });
});

const changePaymentStatus = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    console.log(`PUT /api/v1/order/${orderId}/payment`);
    const { status } = req.query;
    const updatedOrder = await orderService.updatePaymentStatusOfAOrder(
        Number(orderId), String(status)
    );
    return res.status(200).json({
        order: updatedOrder, message: "Payment_Status updated!"
    });
});

export { placeOrder, getMyOrders, getRestaurantOrders, changeOrderStatus, changePaymentStatus };