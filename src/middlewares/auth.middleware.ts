import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { UnauthorizedError } from "../utils/GlobalError";
import { User } from "../models/postgres/user.model";

interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
        email?: string
    };
    // user?: User;
}

const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Not Authorized to access" });
    }

    try {
        const decoded = verifyAccessToken(token) as any;
        req.user = decoded;
        next();
    }
    catch(err: any) {
        if(err.name === "TokenExpiredError") {
            return res.status(401).json({ 
                success: false, 
                message: "Authorization Token expired" 
            });
        }
        else {
            return res.status(401).json({ 
                success: false, 
                message: "Token Invalid" 
            });
        }
    }
}

const authorizeRoles = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if(!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized" 
            });
        }

        if(!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: "Forbidden: Insufficient permissions" 
            });
        }

        next();
    };
};

export { authenticate, authorizeRoles, AuthRequest };