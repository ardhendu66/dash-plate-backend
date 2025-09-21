import Restaurant, { IRestaurant } from "../models/mongo/restaurant.model";
import mongoose from "mongoose";
import { ConflictError, InvalidObjectIdError, ServiceNotFoundError, UnauthorizedError } from "../utils/GlobalError";

type CreateRestaurantInput = Partial<Pick<IRestaurant, "name" | "description" | "address" | "cuisine">> & { ownerId: number; };

type UpdateRestaurantInput = Partial<Pick<IRestaurant, "name" | "description" | "address" | "cuisine">>;

export const restaurantService = {

    // create a restaurant (ownerId = Postgres user id)
    createRestaurant: async (payload: CreateRestaurantInput) => {
        const doc = await Restaurant.create({
            name: payload.name,
            description: payload?.description,
            address: payload.address,
            cuisine: payload.cuisine || [],
            ownerId: payload.ownerId,
        });
        return doc;
    },

    // get list with optional filters (search, cuisine) and pagination
    getRestaurants: async (opts: {
        query?: string;
        cuisine?: string;
        page?: number;
        limit?: number;
        ownerId?: number;
    }) => {
        const { query, cuisine, page = 1, limit = 10, ownerId } = opts;
        const filter: any = {};

        if(query) {
            filter.$text = { $search: query };
        }
        if(cuisine) {
            filter.cuisine = cuisine;
        } 
        if(ownerId) {
            filter.ownerId = ownerId;
        }

        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            Restaurant.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
            Restaurant.countDocuments(filter),
        ]);

        return {
            items,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit) || 1,
        };
    },

    // get single restaurant by id
    getRestaurantById: async (restaurantId: string) => {
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            throw new InvalidObjectIdError("mongoose ObjectId not valid");
        }
        const doc = await Restaurant.findById(restaurantId).lean();
        return doc;
    },

    // update restaurant; if ownerId provided
    updateRestaurantById: async (
        restaurantId: string, 
        updates: UpdateRestaurantInput, 
        restaurantOwnerId?: number
    ) => {
        if(!mongoose.Types.ObjectId.isValid(restaurantId)) {
            throw new InvalidObjectIdError("mongoose ObjectId not valid");
        }

        const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, updates);
        if(!restaurant) {
            throw new ServiceNotFoundError("Restaurant you're looking for is not found");
        }

        if(restaurantOwnerId !== undefined && restaurant.ownerId !== restaurantOwnerId) {
            throw new ConflictError("Forbidden: you do not own this restaurant");
        }

        return restaurant.toObject();
    },

    // delete restaurant with optional owner check
    deleteRestaurantById: async (restaurantId: string, restaurantOwnerId?: number) => {
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            throw new InvalidObjectIdError("mongoose ObjectId not valid");
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if(!restaurant) {
            throw new ServiceNotFoundError("Restaurant you're looking for is not found");
        }

        if (restaurantOwnerId !== undefined && restaurant.ownerId !== restaurantOwnerId) {
            throw new UnauthorizedError("Forbidden: you do not own this restaurant");
        }

        await Restaurant.findByIdAndDelete(restaurantId);
        return true;
    },
};