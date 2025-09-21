import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import orderService from "../services/order.service";

const placeOrder = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const order = await orderService.checkout(userId, req.body);
    return res.status(202).json({
        order, message: "Order placed!"
    });
});

export { placeOrder };