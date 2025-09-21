import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";

const catchAsync = (
  fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as AuthRequest, res, next).catch(next);
  };
};

export { catchAsync };