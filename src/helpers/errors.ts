const Exception = (name: string, message: string, cause: any) => {
    return {
        name,
        message,
        cause
    };
}

export default {
    FOOD_NOT_FOUND: (cause: any) => {
        return Exception("FoodNotFound", "Food with given id not found", cause);
    }
}