import { UserModel, User } from "../models/postgres/user.model";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { ConflictError, UnauthorizedError } from "../utils/GlobalError";

const sanitizeUser = (user: User) => {
    const { password, ...rest } = user;
    return rest;
};

const authService = {
    signup: async function (data: User) {
        const existingUser = await UserModel.findUserByEmail(data.email);

        if (existingUser) {
            throw new ConflictError("Email already in use");
        }

        const user = await UserModel.createUser(data);

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role
        });

        const refreshToken = generateRefreshToken({
            id: user.id,
            role: user.role
        });

        return { 
            user: sanitizeUser(user), accessToken, refreshToken
        };
    },
    login: async function (email: string, password: string) {     
        const existingUser = await UserModel.findUserByEmail(email);      

        if (!existingUser) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);        

        if (!isMatch) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const accessToken = generateAccessToken({
            id: existingUser.id,
            role: existingUser.role
        });

        const refreshToken = generateRefreshToken({
            id: existingUser.id,
            role: existingUser.role
        });

        return {
            user: sanitizeUser(existingUser), accessToken, refreshToken
        };
    },
    refresh: async function (token: string) {
        try {
            const { id, role } = verifyRefreshToken(token) as { id: number, role: string };
            const newAccessToken = generateAccessToken({ id, role });
            return newAccessToken;
        }
        catch (err) {
            throw new UnauthorizedError("Invalid refresh token");
        }
    }
};

export { authService };