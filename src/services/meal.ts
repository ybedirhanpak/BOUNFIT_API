import { Schema } from "mongoose";
import Meal from "../models/meal";
import {
    IMealModel,
    IMealCreateDTO,
    IAddIngredientDTO,
    IUpdateIngredientDTO,
    IRemoveIngredientDTO,
    Ingredient
} from "../interfaces/meal";
import errors from "../helpers/errors";
import FoodService from "../services/food";

const exists = async (meal: Schema.Types.ObjectId): Promise<boolean> => {
    return await Meal.exists({ $and: [{ isDeleted: false }, { _id: meal }] });
}

const create = async (mealCreateDTO: IMealCreateDTO): Promise<IMealModel> => {
    const mealIn: IMealModel = {
        ...mealCreateDTO,
        isDeleted: false
    };
    //Check if there are any invalid foods.
    let invalidFood = null;
    for (let i = 0; i < mealCreateDTO.ingredients.length; i++) {
        const foodExists = await FoodService.exists(mealCreateDTO.ingredients[i].food);
        if (!foodExists) {
            invalidFood = mealCreateDTO.ingredients[i].food;
        }
    }

    if (invalidFood)
        throw errors.FOOD_NOT_FOUND(`Food with id: ${invalidFood} doesn't exist.`);

    return new Meal(mealIn).save();
}

const getAll = async (): Promise<IMealModel[]> => {
    return Meal.find({ isDeleted: false });
}

const getAllDeleted = async (): Promise<IMealModel[]> => {
    return Meal.find({ isDeleted: true });
}

const getById = async (mealId: string): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        { $and: [{ isDeleted: false }, { _id: mealId }] }
    )
    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

    return meal;
}

const deleteById = async (mealId: string): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        { $and: [{ isDeleted: false }, { _id: mealId }] }
    )
    if (!meal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

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

const updateIngredient = async (mealId: string, updateIngredientDTO: IUpdateIngredientDTO): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        { $and: [{ isDeleted: { $eq: false } }, { _id: mealId }] }
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

const removeIngredient = async (mealId: string, removeIngredientDTO: IRemoveIngredientDTO): Promise<IMealModel> => {
    const meal = await Meal.findOne(
        { $and: [{ isDeleted: { $eq: false } }, { _id: mealId }] }
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