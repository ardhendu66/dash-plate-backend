import { Request, Response } from "express";
import { restaurantService } from "../services/restaurant.service";
import { 
    createRestaurantSchema, updateRestaurantSchema 
} from "../validators/restaurant.validator";
import { AuthRequest } from "../middlewares/auth.middleware";
import { catchAsync } from "../utils/catchAsync";
import { ServiceNotFoundError } from "../utils/GlobalError";

const createRestaurant = catchAsync(async (req: AuthRequest, res: Response) => {
    console.log(`POST /api/v1/restaurant`);
    const validated = createRestaurantSchema.parse(req.body);

    const restaurant = await restaurantService.createRestaurant({ 
        ...validated, 
        ownerId: Number(req.user!.id)
    });

    return res.status(201).json({
        success: true,
        message: "Restaurant created",
        restaurant,
    });
});

const listRestaurants = catchAsync(async (req: Request, res: Response) => {
    console.log(`GET /api/v1/restaurant/all`);
    const { query, cuisine, page = "1", limit = "10", ownerId } = req.query;

    const result = await restaurantService.getRestaurants({
        query: typeof query === "string" ? query : undefined,
        cuisine: typeof cuisine === "string" ? cuisine : undefined,
        page: Number(page),
        limit: Number(limit),
        ownerId: ownerId ? Number(ownerId) : undefined,
    });

    return res.status(200).json({ success: true, ...result });
});

const getRestaurant = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`GET /api/v1/restaurant/${id}`);
    const restaurant = await restaurantService.getRestaurantById(id);

    if(!restaurant) {
        throw new ServiceNotFoundError("Restaurant not found");
    }

    return res.json({ success: true, restaurant });
});

const updateRestaurant = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    console.log(`PUT /api/v1/restaurant/${id}`);
    const validated = updateRestaurantSchema.parse(req.body);

    const ownerId = req.user!.role === "vendor" ? Number(req.user!.id) : undefined;

    const updated = await restaurantService.updateRestaurantById(id, validated, ownerId);

    return res.status(202).json({ 
        success: true, 
        message: "Restaurant updated", 
        restaurant: updated 
    });
});

const deleteRestaurant = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    console.log(`DELETE /api/v1/restaurant/${id}`);

    const ownerId = req.user!.role === "vendor" ? Number(req.user!.id) : undefined;

    const deleted = await restaurantService.deleteRestaurantById(id, ownerId);

    if(!deleted) {
        throw new ServiceNotFoundError("Restaurant not found");
    }
    
    return res.status(202).json({ 
        success: true, 
        message: "Restaurant deleted" 
    });
});

export {
    createRestaurant, listRestaurants, getRestaurant, updateRestaurant, deleteRestaurant,
};