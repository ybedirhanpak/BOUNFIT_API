import { Schema } from "mongoose";
import Meal from "../models/meal";
import {
    IMealModel,
    IMealCreateDTO,
    IAddIngredientDTO,
    IUpdateIngredientDTO,
    IRemoveIngredientDTO
} from "../interfaces/meal";
import errors from "../helpers/errors";
import FoodService from "../services/food";

const QUERIES = {
    GET_BY_ID: (id: string | Schema.Types.ObjectId) => ({ $and: [{ isDeleted: false }, { _id: id }] }),
    GET_DELETED_BY_ID: (id: string | Schema.Types.ObjectId) => ({ $and: [{ isDeleted: true }, { _id: id }] }),
    NOT_DELETED: { isDeleted: false },
    DELETED: { isDeleted: true },
    POPULATE_FOODS: {
        path: "foods",
        match: { isDeleted: false },
    }
}

const exists = async (mealId: string | Schema.Types.ObjectId): Promise<boolean> => {
    return await Meal.exists(QUERIES.GET_BY_ID(mealId));
}

const create = async (mealCreateDTO: IMealCreateDTO): Promise<IMealModel> => {
    const mealIn: IMealModel = {
        ingredients: [],
        isDeleted: false,
        ...mealCreateDTO
    };

    //Check if there are any invalid foods.
    let invalidFood = null;
    for (let i = 0; i < mealIn.ingredients.length; i++) {
        const foodExists = await FoodService.exists(mealIn.ingredients[i].food);
        if (!foodExists) {
            invalidFood = mealIn.ingredients[i].food;
            break;
        }
    }

    if (invalidFood)
        throw errors.FOOD_NOT_FOUND(`Food with id: ${invalidFood} doesn't exist.`);

    return new Meal(mealIn).save();
}

const getAll = async (): Promise<IMealModel[]> => {
    return Meal.find(QUERIES.NOT_DELETED)
        .populate(QUERIES.POPULATE_FOODS);
}

const getAllDeleted = async (): Promise<IMealModel[]> => {
    return Meal.find({ isDeleted: true });
}

const getById = async (mealId: string | Schema.Types.ObjectId): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        QUERIES.GET_BY_ID(mealId)
    ).populate(QUERIES.POPULATE_FOODS);

    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

    return meal;
}

const deleteById = async (mealId: string | Schema.Types.ObjectId): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        QUERIES.GET_BY_ID(mealId)
    )
    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

    meal.isDeleted = true;
    return meal.save();
}

const restoreById = async (mealId: string | Schema.Types.ObjectId): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        QUERIES.GET_DELETED_BY_ID(mealId)
    )
    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

    meal.isDeleted = false;
    return meal.save();
}

const addIngredient = async (mealId: string | Schema.Types.ObjectId,
    addIngredientDTO: IAddIngredientDTO): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        QUERIES.GET_BY_ID(mealId)
    );
    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

    const { ingredient } = addIngredientDTO;
    if (!ingredient)
        throw errors.INVALID_INGREDIENT("Ingredient object is missing in request.");

    if (!ingredient.food)
        throw errors.INVALID_INGREDIENT("Food in ingredient object is missing.");

    if (!ingredient.quantity) {
        throw errors.INVALID_INGREDIENT("Quantity in ingredient object is missing.");
    }

    if (ingredient.quantity <= 0) {
        throw errors.INVALID_INGREDIENT("Quantity cannot be less than zero.");
    }

    const foodExists = await FoodService.exists(ingredient.food);
    if (!foodExists)
        throw errors.FOOD_NOT_FOUND(`Food with id: ${ingredient.food} doesn't exist.`);

    const oldIndex = meal.ingredients.findIndex(i => i.food == ingredient.food);
    console.log(oldIndex)
    //If ingredient already exists, increase its quantity
    if (oldIndex > -1) {
        const ingredientOld = meal.ingredients[oldIndex];
        ingredientOld.quantity = parseFloat(ingredientOld.quantity.valueOf().toString()) +
            parseFloat(ingredient.quantity.valueOf().toString());
    } else {
        meal.ingredients.push(ingredient);
    }

    return meal.save();
}

const updateIngredient = async (mealId: string | Schema.Types.ObjectId,
    updateIngredientDTO: IUpdateIngredientDTO): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        QUERIES.GET_BY_ID(mealId)
    );

    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

    const { ingredientId, ingredient } = updateIngredientDTO;
    if (!ingredient)
        throw errors.INVALID_INGREDIENT("Ingredient object is missing in request.");

    if (!ingredientId)
        throw errors.INVALID_INGREDIENT("Ingredient id is missing in request.");

    const oldIndex = meal.ingredients.findIndex(i => i._id == ingredientId);

    //If ingredient doesn't exists in the list, throw error
    if (oldIndex === -1)
        throw errors.INGREDIENT_NOT_FOUND(`Ingredient with id: ${ingredientId} ` +
            `doesn't exist in ingredients list of meal: ${meal.name}.`);

    const ingredientOld = meal.ingredients[oldIndex];
    const { food, quantity } = ingredient;

    if (food) {
        const foodExists = await FoodService.exists(food);
        if (!foodExists)
            throw errors.FOOD_NOT_FOUND(`Food with id: ${food} doesn't exist.`);

        ingredientOld.food = food;
    }

    if (quantity) {
        if (quantity < 0)
            throw errors.INVALID_INGREDIENT("Quantity cannot be less than zero.");

        ingredientOld.quantity = quantity;
    }

    return meal.save();
}

const removeIngredient = async (mealId: string | Schema.Types.ObjectId,
    removeIngredientDTO: IRemoveIngredientDTO): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        QUERIES.GET_BY_ID(mealId)
    );

    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

    const { ingredient } = removeIngredientDTO;

    if (!ingredient)
        throw errors.INVALID_INGREDIENT("Ingredient object is missing in request.");

    const oldIndex = meal.ingredients.findIndex(i => i._id == ingredient);

    //If ingredient doesn't exists in the list, throw error
    if (oldIndex === -1)
        throw errors.INGREDIENT_NOT_FOUND(`Ingredient with id: ${ingredient} ` +
            `doesn't exist in ingredients list of meal: ${meal.name}.`);

    //Remove ingredient from list
    meal.ingredients.splice(oldIndex, 1);

    return meal.save();
}

export default {
    exists,
    create,
    getAll,
    getAllDeleted,
    getById,
    deleteById,
    restoreById,
    addIngredient,
    updateIngredient,
    removeIngredient
}