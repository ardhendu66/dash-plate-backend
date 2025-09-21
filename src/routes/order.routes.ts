import { Router } from "express";
import { placeOrder } from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware";

const orderRouter = Router();

// protected routes
orderRouter.route("/place").post(authenticate, placeOrder);

export default orderRouter;