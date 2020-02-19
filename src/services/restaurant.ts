import { Schema } from "mongoose";
import Restaurant from "../models/restaurant";
import {
    IRestaurantModel,
    IRestaurantCreateDTO,
    IAddRemoveFoodDTO,
    IAddRemoveMealDTO
} from "../interfaces/restaurant";
import errors from "../helpers/errors";
import MealService from "../services/meal";
import FoodService from "../services/food";

const QUERIES = {
    GET_BY_ID: (id: string | Schema.Types.ObjectId) => ({ $and: [{ isDeleted: false }, { _id: id }] }),
    GET_DELETED_BY_ID: (id: string | Schema.Types.ObjectId) => ({ $and: [{ isDeleted: true }, { _id: id }] }),
    NOT_DELETED: { isDeleted: false },
    DELETED: { isDeleted: true },
    POPULATE_FOODS: {
        path: "foods",
        match: { isDeleted: false },
    },
    POPULATE_MEALS: {
        path: "meals",
        match: { isDeleted: false }
    }
}

const exists = async (restaurantId: string | Schema.Types.ObjectId): Promise<boolean> => {
    return await Restaurant.exists(QUERIES.GET_BY_ID(restaurantId));
}

const create = async (restaurantDTO: IRestaurantCreateDTO): Promise<IRestaurantModel> => {
    const restaurantIn: IRestaurantModel = {
        foods: [],
        meals: [],
        isDeleted: false,
        ...restaurantDTO
    };

    let invalidFood = null;
    for (let i = 0; i < restaurantIn.foods.length; i++) {
        const foodExists = await FoodService.exists(restaurantIn.foods[i]);
        if (!foodExists) {
            invalidFood = restaurantIn.foods[i];
            break;
        }
    }

    let invalidMeal = null;
    for (let i = 0; i < restaurantIn.meals.length; i++) {
        const mealExists = await MealService.exists(restaurantIn.meals[i]);
        if (!mealExists) {
            invalidMeal = restaurantIn.meals[i];
            break;
        }
    }

    if (invalidFood)
        throw errors.FOOD_NOT_FOUND(`Food with id: ${invalidFood} doesn't exist.`);

    if (invalidMeal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${invalidMeal} doesn't exist.`);

    return await new Restaurant(restaurantIn).save();
}

const getAll = async (): Promise<IRestaurantModel[]> => {
    return await Restaurant.find(QUERIES.NOT_DELETED)
        .populate(QUERIES.POPULATE_FOODS)
        .populate(QUERIES.POPULATE_MEALS);
}

const getAllDeleted = async (): Promise<IRestaurantModel[]> => {
    return await Restaurant.find(QUERIES.DELETED);
}

const getById = async (restaurantId: string): Promise<IRestaurantModel> => {
    const restaurant = await Restaurant.findOne(
        QUERIES.GET_BY_ID(restaurantId)
    )
    if (!restaurant)
        throw errors.RESTAURANT_NOT_FOUND();
    return restaurant;
}

const deleteById = async (restaurantId: string): Promise<IRestaurantModel> => {
    const restaurant = await Restaurant.findOne(
        QUERIES.GET_BY_ID(restaurantId)
    )
    if (!restaurant)
        throw errors.RESTAURANT_NOT_FOUND();
    restaurant.isDeleted = true;
    return restaurant.save();
}

const restoreById = async (restaurantId: string): Promise<IRestaurantModel> => {
    const restaurant = await Restaurant.findOne(
        QUERIES.GET_DELETED_BY_ID(restaurantId)
    )
    if (!restaurant)
        throw errors.RESTAURANT_NOT_FOUND();
    restaurant.isDeleted = false;
    return restaurant.save();
}

const addMeal = async (restaurantId: string, addMealDTO: IAddRemoveMealDTO): Promise<IRestaurantModel> => {
    const restaurant = await Restaurant.findOne(
        QUERIES.GET_BY_ID(restaurantId)
    );

    if (!restaurant)
        throw errors.RESTAURANT_NOT_FOUND();

    const { meal } = addMealDTO;
    if (!meal)
        throw errors.VALIDATION_ERROR("Meal is missing in request.");

    const mealExists = await MealService.exists(meal);
    if (!mealExists)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${meal} doesn't exist`);

    const oldIndex = restaurant.meals.findIndex(m => m == meal);
    if (oldIndex > -1)
        throw errors.MEAL_ALREADY_EXISTS(`Meal with id: ${meal} already exists in restaurant: ${restaurant.name}`);

    //Add meal to list
    restaurant.meals.push(meal);
    return restaurant.save();
}

const removeMeal = async (restaurantId: string, removeMealDTO: IAddRemoveMealDTO): Promise<IRestaurantModel> => {
    const restaurant = await Restaurant.findOne(
        QUERIES.GET_BY_ID(restaurantId)
    );

    if (!restaurant)
        throw errors.RESTAURANT_NOT_FOUND();

    const { meal } = removeMealDTO;
    if (!meal)
        throw errors.VALIDATION_ERROR("Meal is missing in request.");

    const mealExists = await MealService.exists(meal);
    if (!mealExists)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${meal} doesn't exist`);

    const oldIndex = restaurant.meals.findIndex(m => m == meal);
    if (oldIndex === -1)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${meal} doesn't exist in restaurant: ${restaurant.name}`);

    //Remove meal from list
    restaurant.meals.splice(oldIndex, 1);
    return restaurant.save();
}

const addFood = async (restaurantId: string, addFoodDTO: IAddRemoveFoodDTO): Promise<IRestaurantModel> => {
    const restaurant = await Restaurant.findOne(
        QUERIES.GET_BY_ID(restaurantId)
    );

    if (!restaurant)
        throw errors.RESTAURANT_NOT_FOUND();

    const { food } = addFoodDTO;
    if (!food)
        throw errors.VALIDATION_ERROR("Food is missing in request.");

    const foodExists = await FoodService.exists(food);
    if (!foodExists)
        throw errors.FOOD_NOT_FOUND(`Food with id: ${food} doesn't exist`);

    const oldIndex = restaurant.foods.findIndex(m => m == food);
    if (oldIndex > -1)
        throw errors.FOOD_ALREADY_EXISTS(`Food with id: ${food} already exists in restaurant: ${restaurant.name}`);

    //Add food to list
    restaurant.foods.push(food);
    return restaurant.save();
}

const removeFood = async (restaurantId: string, removeFoodDTO: IAddRemoveFoodDTO): Promise<IRestaurantModel> => {
    const restaurant = await Restaurant.findOne(
        QUERIES.GET_BY_ID(restaurantId)
    );

    if (!restaurant)
        throw errors.RESTAURANT_NOT_FOUND();

    const { food } = removeFoodDTO;
    if (!food)
        throw errors.VALIDATION_ERROR("Food is missing in request.");

    const foodExists = await FoodService.exists(food);
    if (!foodExists)
        throw errors.FOOD_NOT_FOUND(`Food with id: ${food} doesn't exist`);

    const oldIndex = restaurant.foods.findIndex(m => m == food);
    if (oldIndex > -1)
        throw errors.FOOD_ALREADY_EXISTS(`Food with id: ${food} already exists in restaurant: ${restaurant.name}`);

    //Add food to list
    restaurant.foods.push(food);
    return restaurant.save();
}

export default {
    exists,
    create,
    getAll,
    getAllDeleted,
    getById,
    deleteById,
    restoreById,
    addMeal,
    removeMeal,
    addFood,
    removeFood
}