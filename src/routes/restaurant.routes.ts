import { Router } from "express";
import { 
    createRestaurant, listRestaurants, getRestaurant, updateRestaurant, deleteRestaurant 
} from "../controllers/restaurant.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const restaurantRouter = Router();

// public routes
restaurantRouter.route("/all").get(listRestaurants);
restaurantRouter.route("/:id").get(getRestaurant);

// vendor/admin protected routes
restaurantRouter.route("/").post(
    authenticate, authorizeRoles("admin", "vendor"), createRestaurant
);
restaurantRouter.route("/:id").put(
    authenticate, authorizeRoles("admin", "vendor"), updateRestaurant
);
restaurantRouter.route("/:id").delete(
    authenticate, authorizeRoles("admin", "vendor"), deleteRestaurant
);

export default restaurantRouter;