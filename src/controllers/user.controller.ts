import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { catchAsync } from "../utils/catchAsync";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ServiceNotFoundError, ServiceUnavailableError } from "../utils/GlobalError";

// get profile: User
const getMyProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await userService.getUserById(req.user!.id);
    if (!user) {
        throw new ServiceNotFoundError("User not found");
    }
    return res.status(200).json({ user });
})

// get user-lists: Admin
const getAllUsers = catchAsync(async (req: AuthRequest, res: Response) => {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users });
});

// update profile: User
const updateMyProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    const updates = req.body;
    const updated = await userService.updateUserProfileById(req.user!.id, updates);
    return res.status(200).json({ message: "user Profile updated", user: updated });
});

// update user role: Admin
const updateUserRole = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    const updated = await userService.updateUserRole(Number(id), role);
    if(!updated) {
        throw new ServiceNotFoundError("User not found");
    }
    return res.status(202).json({ message: "Role of user updated", user: updated });
});

// delete user: Admin
const deleteUser = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const deleted = await userService.deleteUser(Number(id));
    if(!deleted) {
        throw new ServiceUnavailableError("User not deleted");
    }
    return res.status(202).json({ message: "User deleted successfully" });
});

export {
    getMyProfile, getAllUsers, updateMyProfile, updateUserRole, deleteUser
};