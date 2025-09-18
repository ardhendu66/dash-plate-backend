import { Router } from "express";
import { 
    addMenuItem, getMenuItems, updateMenuItem, deleteMenuItem 
} from "../controllers/menu.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const menuRouter = Router();

// ✅ Public routes
menuRouter.route("/:restaurantId").get(getMenuItems);


// ✅ Vendor/Admin: protected routes
menuRouter.route("/:restaurantId").post(
    authenticate, authorizeRoles("vendor", "admin"), addMenuItem
);

menuRouter.route("/:restaurantId/:itemId").put(
    authenticate, authorizeRoles("vendor", "admin"), updateMenuItem
);

menuRouter.route("/:restaurantId/:itemId").delete(
    authenticate, authorizeRoles("vendor", "admin"), deleteMenuItem
);

export default menuRouter;