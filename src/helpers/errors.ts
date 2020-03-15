const Exception = (name: string, message: string, cause: any) => ({
  name,
  message,
  cause,
});

export enum errorNames {
    INTERNAL_ERROR = 'InternalError',
    VALIDATION_ERROR = 'ValidationError',
    JWT_SECRET_ERROR = 'JwtSecretError',
    FOOD_NOT_FOUND = 'FoodNotFound',
    FOOD_ALREADY_EXISTS = 'FoodAlreadyExists',
    INVALID_FOOD = 'InvalidFood',
    MEAL_NOT_FOUND = 'MealNotFound',
    MEAL_ALREADY_EXISTS = 'MealAlreadyExists',
    INGREDIENT_NOT_FOUND = 'IngredientNotFound',
    INVALID_INGREDIENT = 'InvalidIngredient',
    DAILY_PLAN_NOT_FOUND = 'DailyPlanNotFound',
    RESTAURANT_NOT_FOUND = 'RestaurantNotFound',
    GROCERY_STORE_NOT_FOUND = 'GroceryStoreNotFound',
    USER_NOT_FOUND = 'UserNotFound'
}

export default {
  INTERNAL_ERROR: (cause?: any) => Exception(errorNames.INTERNAL_ERROR, 'Internal error occured while processing the request.', cause),
  VALIDATION_ERROR: (cause?: any) => Exception(errorNames.VALIDATION_ERROR, 'Validation error.', cause),
  JWT_SECRET_ERROR: (cause?: any) => Exception(errorNames.JWT_SECRET_ERROR, 'Jwt secret error.', cause),
  FOOD_NOT_FOUND: (cause?: any) => Exception(errorNames.FOOD_NOT_FOUND, 'Food with given id not found', cause),
  FOOD_ALREADY_EXISTS: (cause?: any) => Exception(errorNames.FOOD_ALREADY_EXISTS, 'Food with given id already exists in list.', cause),
  INVALID_FOOD: (cause?: any) => Exception(errorNames.INVALID_FOOD, 'Given food is invalid.', cause),
  MEAL_NOT_FOUND: (cause?: any) => Exception(errorNames.MEAL_NOT_FOUND, 'Meal with given id not found.', cause),
  MEAL_ALREADY_EXISTS: (cause?: any) => Exception(errorNames.MEAL_ALREADY_EXISTS, 'Meal with given id already exists in list.', cause),
  INGREDIENT_NOT_FOUND: (cause?: any) => Exception(errorNames.INGREDIENT_NOT_FOUND, 'Ingredient with given id not found in list', cause),
  INVALID_INGREDIENT: (cause?: any) => Exception(errorNames.INVALID_INGREDIENT, 'Invalid Ingredient', cause),
  DAILY_PLAN_NOT_FOUND: (cause?: any) => Exception(errorNames.DAILY_PLAN_NOT_FOUND, 'Daily plan with given id not found', cause),
  RESTAURANT_NOT_FOUND: (cause?: any) => Exception(errorNames.RESTAURANT_NOT_FOUND, 'Restaurant with given id not found', cause),
  GROCERY_STORE_NOT_FOUND: (cause?: any) => Exception(errorNames.GROCERY_STORE_NOT_FOUND, 'Grocery store with given id not found', cause),
  USER_NOT_FOUND: (cause?: any) => Exception(errorNames.USER_NOT_FOUND, 'User with given id not found', cause),
};
