import { Schema } from "mongoose";
import Meal from "../models/meal";
import {
    IMealModel,
    IMealCreateDTO,
    IAddIngredientDTO,
    IUpdateIngredientDTO,
    Ingredient,
    IRemoveIngredientDTO
} from "../interfaces/meal";
import errors from "../helpers/errors";
import FoodService from "../services/food";

export const isMealValid = (meal: Schema.Types.ObjectId): boolean => {
    let result = false;
    Meal.exists({ $and: [{ isDeleted: false }, { _id: meal }] }, (err, res) => {
        if (!err)
            result = res;
    });
    return result;
}

const create = async (mealDTO: IMealCreateDTO): Promise<IMealModel> => {
    const mealIn: IMealModel = {
        ...mealDTO,
        isDeleted: false
    };
    return new Meal(mealIn).save();
}

const getAll = async (): Promise<IMealModel[]> => {
    return await Meal.find({ isDeleted: false });
}

const getAllDeleted = async (): Promise<IMealModel[]> => {
    return await Meal.find({ isDeleted: true });
}

const getById = async (mealId: string): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        { $and: [{ isDeleted: false }, { _id: mealId }] }
    )
    if (!meal)
        throw errors.MEAL_NOT_FOUND();

    return meal;
}

const deleteById = async (mealId: string): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        { $and: [{ isDeleted: false }, { _id: mealId }] }
    )
    if (!meal)
        throw errors.MEAL_NOT_FOUND();

    meal.isDeleted = true;
    return meal.save();
}

const restoreById = async (mealId: string): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        { $and: [{ isDeleted: true }, { _id: mealId }] }
    )
    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

    meal.isDeleted = false;
    return meal.save();
}

const addIngredient = async (mealId: string, addIngredientDTO: IAddIngredientDTO): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        { $and: [{ isDeleted: { $eq: false } }, { _id: mealId }] }
    );
    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

    const { ingredient } = addIngredientDTO;
    if (!ingredient)
        throw errors.VALIDATION_ERROR("Ingredient object is missing in request.");

    if (!ingredient.food)
        throw errors.VALIDATION_ERROR("Food is missing in request");

    if (!ingredient.quantity || ingredient.quantity <= 0) {
        throw errors.VALIDATION_ERROR("Quantity is missing or non-positive number");
    }

    const foodExists = await FoodService.exists(ingredient.food);
    if (!foodExists)
        throw errors.FOOD_NOT_FOUND(`Food with id: ${ingredient.food} doesn't exist.`);

    const oldIndex = meal.ingredients.findIndex(i => i.food == ingredient.food);
    console.log(oldIndex)
    //If ingredient already exists, increase its quantity
    if (oldIndex > -1) {
        const ingredientOld = meal.ingredients[oldIndex];
        ingredientOld.quantity = ingredientOld.quantity.valueOf() +
            ingredient.quantity.valueOf();
    } else {
        meal.ingredients.push(ingredient);
    }

    return meal.save();
}

const updateIngredient = async (mealId: string, updateIngredientDTO: IUpdateIngredientDTO): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        { $and: [{ isDeleted: { $eq: false } }, { _id: mealId }] }
    );

    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

    const { ingredientId, ingredient } = updateIngredientDTO;
    if (!ingredient)
        throw errors.VALIDATION_ERROR("Ingredient object is missing in request.");

    if (!ingredientId)
        throw errors.VALIDATION_ERROR("Ingredient id is missing in request.");

    const oldIndex = meal.ingredients.findIndex(i => i._id == ingredientId);

    //If ingredient doesn't exists in the list, throw error
    if (oldIndex === -1)
        throw errors.INGREDIENT_NOT_FOUND(`Ingredient with id: ${ingredientId}` +
            `doesn't exist in ingredients list of meal: ${meal.name}.`);

    const ingredientOld = meal.ingredients[oldIndex];
    const { food, quantity } = ingredient;

    if (food) {
        const foodExists = await FoodService.exists(food);
        if (!foodExists)
            throw errors.FOOD_NOT_FOUND(`Food with id: ${food} doesn't exist.`);

        ingredientOld.food = food;
    }

    if (quantity && quantity > 0)
        ingredientOld.quantity = quantity;

    return meal.save();
}

const removeIngredient = async (mealId: string, removeIngredientDTO: IRemoveIngredientDTO): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        { $and: [{ isDeleted: { $eq: false } }, { _id: mealId }] }
    );

    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

    const { ingredient } = removeIngredientDTO;
    if (!ingredient)
        throw errors.VALIDATION_ERROR("Ingredient object is missing in request.");

    const oldIndex = meal.ingredients.findIndex(i => i._id == ingredient);

    //If ingredient doesn't exists in the list, throw error
    if (oldIndex === -1)
        throw errors.INGREDIENT_NOT_FOUND(`Ingredient with id: ${ingredient}` +
            `doesn't exist in ingredients list of meal: ${meal.name}.`);

    //Remove ingredient from list
    meal.ingredients.splice(oldIndex, 1);

    return meal.save();
}

export default {
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