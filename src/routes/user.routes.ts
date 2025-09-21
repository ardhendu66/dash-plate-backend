import { Router } from "express";
import { 
    getMyProfile, getAllUsers, updateMyProfile, updateUserRole, deleteUser 
} from "../controllers/user.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
const userRouter = Router();

// logged-in user
userRouter.route("/users/me").get(authenticate, getMyProfile);
userRouter.route("/users/me").put(authenticate, updateMyProfile);

// admin-only
userRouter.route("/admin/users/all").get(authenticate, authorizeRoles("admin"), getAllUsers);
userRouter.route("/admin/users/:id/role").put(authenticate, authorizeRoles("admin"), updateUserRole);
userRouter.route("/admin/users/:id/delete").delete(authenticate, authorizeRoles("admin"), deleteUser);

export default userRouter;