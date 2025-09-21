import { Request, Response, NextFunction } from "express";
import { tableService } from "../services/table.service";
import { catchAsync } from "../utils/catchAsync";

const createUserTable = catchAsync(async (req: Request, res: Response) => {  
    const msg = await tableService.createUserTable();
    return res.status(201).json({ message: msg });
});

const createOrderTable = catchAsync(async (req: Request, res: Response) => {  
    const msg = await tableService.createOrderTable();
    return res.status(201).json({ message: msg });
});

const createBulkUsers = catchAsync(async (req: Request, res: Response) => {
    const msg = await tableService.createBulkUsers();
    return res.status(201).json({ message: msg });
});

const deleteBulkUsers = catchAsync(async (req: Request, res: Response) => {
    const msg = await tableService.deleteBulkUsers();
    return res.status(202).json({ message: msg });
});

export { createUserTable, createOrderTable, createBulkUsers, deleteBulkUsers };