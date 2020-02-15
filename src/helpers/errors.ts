const Exception = (name: string, message: string, cause: any) => {
    return {
        name,
        message,
        cause
    };
}

export enum errorNames {
    INTERNAL_ERROR = "InternalError",
    VALIDATION_ERROR = "ValidationError",
    FOOD_NOT_FOUND = "FoodNotFound",
    FOOD_ALREADY_EXISTS = "FoodAlreadyExists",
    MEAL_NOT_FOUND = "MealNotFound",
    MEAL_ALREADY_EXISTS = "MealAlreadyExists",
    INGREDIENT_NOT_FOUND = "IngredientNotFound",
    DAILY_PLAN_NOT_FOUND = "DailyPlanNotFound",
    RESTAURANT_NOT_FOUND = "RestaurantNotFound",
    GROCERY_STORE_NOT_FOUND = "GroceryStoreNotFound"
}

export default {
    INTERNAL_ERROR: (cause?: any) => {
        return Exception(errorNames.INTERNAL_ERROR, "Internal error occured while processing the request.", cause);
    },
    VALIDATION_ERROR: (cause?: any) => {
        return Exception("ValidationError", "Validation error.", cause);
    },
    //Foods
    FOOD_NOT_FOUND: (cause?: any) => {
        return Exception(errorNames.FOOD_NOT_FOUND, "Food with given id not found", cause);
    },
    FOOD_ALREADY_EXISTS: (cause?: any) => {
        return Exception(errorNames.FOOD_ALREADY_EXISTS, "Food with given id already exists in list.", cause);
    },
    //Meals
    MEAL_NOT_FOUND: (cause?: any) => {
        return Exception(errorNames.MEAL_NOT_FOUND, "Meal with given id not found.", cause);
    },
    MEAL_ALREADY_EXISTS: (cause?: any) => {
        return Exception(errorNames.MEAL_ALREADY_EXISTS, "Meal with given id already exists in list.", cause);
    },
    INGREDIENT_NOT_FOUND: (cause?: any) => {
        return Exception(errorNames.INGREDIENT_NOT_FOUND, "Ingredient with given id not found in list", cause);
    },
    DAILY_PLAN_NOT_FOUND: (cause?: any) => {
        return Exception(errorNames.DAILY_PLAN_NOT_FOUND, "Daily plan with given id not found", cause);
    },
    RESTAURANT_NOT_FOUND: (cause?: any) => {
        return Exception(errorNames.RESTAURANT_NOT_FOUND, "Restaurant with given id not found", cause);
    },
    GROCERY_STORE_NOT_FOUND: (cause?: any) => {
        return Exception(errorNames.GROCERY_STORE_NOT_FOUND, "Grocery store with given id not found", cause);
    },
}