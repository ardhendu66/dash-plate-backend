interface CartItem {
    menuItemId: string,
    quantity: number,
    price: number,
}

interface Cart {
    restaurantId: string,
    items: CartItem[],
    totalAmount: number,
}

export { Cart, CartItem };