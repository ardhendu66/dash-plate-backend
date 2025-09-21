import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { signupSchema, loginSchema } from "../validators/auth.validator";
import { UserResponseDto } from "../dtos/user.dto";
import { UnauthorizedError } from "../utils/GlobalError";
import { catchAsync } from "../utils/catchAsync";

const signup = catchAsync(async (req: Request, res: Response) => {
    const validatedData = signupSchema.parse(req.body);
    const result = await authService.signup(validatedData);

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
        success: true,
        message: "User created successfully",
        accessToken: result.accessToken,
        user: new UserResponseDto(result.user),
    });
});

const login = catchAsync(async (req: Request, res: Response) => { 
    const validatedData = loginSchema.parse(req.body);
    const response = await authService.login(validatedData.email, validatedData.password);

    res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(202).json({
        success: true,
        message: "Login successful",
        accessToken: response.accessToken,
        user: {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role
        }
    });
});

const findRefreshToken = catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        throw new UnauthorizedError("No refresh token provided");
    }

    const newAccessToken = await authService.refresh(token);
    return res.status(200).json({ success: true, accessToken: newAccessToken });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    return res.status(202).json({ success: true, message: "Logout successful" });
});

export { 
    signup, login, findRefreshToken, logout 
};