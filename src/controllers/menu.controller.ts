import { Request, Response, NextFunction } from "express";
import { menuService } from "../services/menu.service";
import { createMenuItemSchema, updateMenuItemSchema } from "../validators/menu.validator";
import { catchAsync } from "../utils/catchAsync";

const addMenuItem = catchAsync(async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    console.log(`POST /api/v1/restaurants/menu/${restaurantId}`);
    const validatedData = createMenuItemSchema.parse(req.body);
    const ownerId = req.user!.id;
    const menuItem = await menuService.addMenuItem(ownerId, validatedData);

    return res.status(201).json({
        success: true,
        message: "Menu item created",
        menuItem,
    });
});

const getMenuItems = catchAsync(async (req: Request, res: Response) => {
    const { restaurantId } = req.params;
    console.log(`GET /api/v1/restaurants/menu/${restaurantId}`);
    const menuItems = await menuService.getMenuItems(restaurantId);

    return res.status(200).json({
        success: true,
        items: menuItems,
        totalItems: menuItems.length
    });
});

const updateMenuItem = catchAsync(async (req: Request, res: Response) => {
    const validatedData = updateMenuItemSchema.parse(req.body);
    const { restaurantId, itemId } = req.params;
    console.log(`PUT /api/v1/restaurants/menu/${restaurantId}/${itemId}`);
    const ownerId = req.user!.id;

    const updated = await menuService.updateMenuItem(
        ownerId,
        restaurantId,
        itemId,
        validatedData
    );

    return res.status(200).json({
        success: true,
        message: "Menu item updated",
        menuItem: updated,
    });
});

const deleteMenuItem = catchAsync(async (req: Request, res: Response) => {
    const { restaurantId, itemId } = req.params;
    console.log(`DELETE /api/v1/restaurants/menu/${restaurantId}/${itemId}`);
    const ownerId = (req as any).user.id;

    await menuService.deleteMenuItem(ownerId, restaurantId, itemId);

    return res.status(200).json({
        success: true,
        message: "Menu item deleted",
    });
});

export {
    addMenuItem, getMenuItems, updateMenuItem, deleteMenuItem,
};