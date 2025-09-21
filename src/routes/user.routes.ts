import { Router } from "express";
import { 
    getMyProfile, getAllUsers, updateMyProfile, updateUserRole, deleteUser 
} from "../controllers/user.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
const userRouter = Router();

// logged-in user
userRouter.route("/profile").get(authenticate, getMyProfile);
userRouter.route("/profile/update").put(authenticate, updateMyProfile);

// admin-only
userRouter.route("/all-users").get(authenticate, authorizeRoles("admin"), getAllUsers);
userRouter.route("/:id/update/role").put(authenticate, authorizeRoles("admin"), updateUserRole);
userRouter.route("/:id/delete").delete(authenticate, authorizeRoles("admin"), deleteUser);

export default userRouter;