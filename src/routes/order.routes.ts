import { Router } from "express";
import { 
    placeOrder, getMyOrders, getRestaurantOrders, changeOrderStatus, changePaymentStatus 
} from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth.middleware";

const orderRouter = Router();

// protected routes
orderRouter.route("/").get(authenticate, getMyOrders);
orderRouter.route("/:restaurantId").get(authenticate, getRestaurantOrders);
orderRouter.route("/place").post(authenticate, placeOrder);
orderRouter.route("/:orderId").put(authenticate, changeOrderStatus);
orderRouter.route("/:orderId/payment").put(authenticate, changePaymentStatus);

export default orderRouter;