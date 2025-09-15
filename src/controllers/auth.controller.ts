import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { signupSchema, loginSchema } from "../validators/auth.validator";
import { UserResponseDto } from "../dtos/user.dto";
import { UnauthorizedError } from "../utils/GlobalError";

const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } 
    catch (err) {
        next(err);
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const response = await authService.login(validatedData.email, validatedData.password);

        res.cookie("refreshToken", response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: response.accessToken,
            user: {
                id: response.user.id,
                email: response.user.email,
                role: response.user.role
            }
        });
    } 
    catch (err) {
        next(err);
    }
};

const findRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            throw new UnauthorizedError("No refresh token provided");
        }

        const newAccessToken = await authService.refresh(token);
        return res.json({ success: true, accessToken: newAccessToken });
    } 
    catch (err) {
        next(err);
    }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
    
        return res.status(200).json({ success: true, message: "Logout successful" });
    }
    catch (err) {
        next(err);
    }
};

export { 
    signup, login, findRefreshToken, logout 
};