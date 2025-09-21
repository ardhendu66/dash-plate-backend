interface CreateMenuItemDTO {
    restaurantId: string;
    name: string;
    description?: string;
    price: number;
    available: boolean;
}

interface UpdateMenuItemDTO {
    name?: string;
    description?: string;
    price?: number;
    available?: boolean;
}

export { CreateMenuItemDTO, UpdateMenuItemDTO };