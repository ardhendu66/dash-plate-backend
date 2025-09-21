import { Router } from "express";
import { getCart, addItem, removeItem, clearCart } from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";

const cartRouter = Router();

// protected routes
cartRouter.route("/").get(authenticate, getCart);
cartRouter.route("/:restaurantId/:menuItemId").post(authenticate, addItem);
cartRouter.route("/:menuItemId").put(authenticate, removeItem);
cartRouter.route("/").delete(authenticate, clearCart);

export default cartRouter;