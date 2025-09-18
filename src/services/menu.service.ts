import MenuItemModel from "../models/mongo/menu.model";
import RestaurantModel from "../models/mongo/restaurant.model";
import { Types } from "mongoose";
import { ServiceNotFoundError, UnauthorizedError } from "../utils/GlobalError";
import { CreateMenuItemDTO, UpdateMenuItemDTO } from "../dtos/menu.dto";

const menuService = {
    async addMenuItem(ownerId: number, data: CreateMenuItemDTO) {
        const restaurant = await RestaurantModel.findById(data.restaurantId);
        if (!restaurant) {
            throw new ServiceNotFoundError("Restaurant not found");
        }

        if (restaurant.ownerId !== ownerId) {
            throw new UnauthorizedError("Forbidden: You are not the owner of this restaurant");
        }

        const menu = MenuItemModel.create({
            restaurantId: new Types.ObjectId(data.restaurantId),
            name: data.name,
            description: data.description,
            price: data.price,
            available: data.available ?? true,
        });

        return menu;
    },
    
    async getMenuItems(restaurantId: string) {
        return await MenuItemModel.find({ restaurantId });
    },
    
    async updateMenuItem(
        ownerId: number,
        restaurantId: string,
        itemId: string,
        data: UpdateMenuItemDTO
    ) {
        const restaurant = await RestaurantModel.findById(restaurantId);
        console.log("Restaurant: ", {
            restaurant, restaurantId, itemId, data
        });        
        if(!restaurant) {
            throw new ServiceNotFoundError("Restaurant not found");
        }

        if (restaurant.ownerId !== ownerId) {
            throw new UnauthorizedError("Forbidden: You are not the owner of this restaurant");
        }

        const updatedItem = await MenuItemModel.findByIdAndUpdate(itemId, { $set: data });

        if (!updatedItem) {
            throw new ServiceNotFoundError("Menu item not found");
        }

        return updatedItem;
    },
    
    async deleteMenuItem(ownerId: number, restaurantId: string, itemId: string) {
        const restaurant = await RestaurantModel.findById(restaurantId);
        if (!restaurant) {
            throw new ServiceNotFoundError("Restaurant not found");
        }

        if (restaurant.ownerId !== ownerId) {
            throw new UnauthorizedError("Forbidden: You are not the owner of this restaurant");
        }

        const deleted = await MenuItemModel.findOneAndDelete({
            _id: itemId,
            restaurantId,
        });

        if(!deleted) {
            throw new ServiceNotFoundError("Menu item not found");
        }

        return deleted;
    }
}

export { menuService };