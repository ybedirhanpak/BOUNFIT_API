import { Schema } from "mongoose";
import GroceryStore from "../models/groceryStore";
import {
    IGroceryStoreModel,
    IGroceryStoreCreateDTO,
    IAddRemoveFoodDTO
} from "../interfaces/groceryStore";
import errors from "../helpers/errors";
import FoodService from "../services/food";

const exists = async (groceryStoreId: string | Schema.Types.ObjectId): Promise<boolean> => {
    return await GroceryStore.exists({ $and: [{ isDeleted: false }, { _id: groceryStoreId }] });
}

const create = async (groceryStoreDTO: IGroceryStoreCreateDTO): Promise<IGroceryStoreModel> => {
    const groceryStoreIn: IGroceryStoreModel = {
        ...groceryStoreDTO,
        isDeleted: false
    };

    let invalidFood = null;
    for (let i = 0; i < groceryStoreIn.foods.length; i++) {
        const foodExists = await FoodService.exists(groceryStoreIn.foods[i]);
        if (!foodExists) {
            invalidFood = groceryStoreIn.foods[i];
            break;
        }
    }

    if (invalidFood)
        throw errors.FOOD_NOT_FOUND(`Food with id: ${invalidFood} doesn't exist.`);

    return await new GroceryStore(groceryStoreIn).save();
}

const getAll = async (): Promise<IGroceryStoreModel[]> => {
    return await GroceryStore.find({ isDeleted: false });
}

const getAllDeleted = async (): Promise<IGroceryStoreModel[]> => {
    return await GroceryStore.find({ isDeleted: true });
}

const getById = async (groceryStoreId: string): Promise<IGroceryStoreModel> => {
    const groceryStore = await GroceryStore.findOne(
        { $and: [{ isDeleted: false }, { _id: groceryStoreId }] }
    )
    if (!groceryStore)
        throw errors.GROCERY_STORE_NOT_FOUND();
    return groceryStore;
}

const deleteById = async (groceryStoreId: string): Promise<IGroceryStoreModel> => {
    const groceryStore = await GroceryStore.findOne(
        { $and: [{ isDeleted: false }, { _id: groceryStoreId }] }
    )
    if (!groceryStore)
        throw errors.GROCERY_STORE_NOT_FOUND();
    groceryStore.isDeleted = true;
    return groceryStore.save();
}

const restoreById = async (groceryStoreId: string): Promise<IGroceryStoreModel> => {
    const groceryStore = await GroceryStore.findOne(
        { $and: [{ isDeleted: true }, { _id: groceryStoreId }] }
    )
    if (!groceryStore)
        throw errors.GROCERY_STORE_NOT_FOUND();
    groceryStore.isDeleted = false;
    return groceryStore.save();
}

const addFood = async (groceryStoreId: string, addFoodDTO: IAddRemoveFoodDTO): Promise<IGroceryStoreModel> => {
    const groceryStore = await GroceryStore.findOne(
        { $and: [{ isDeleted: false }, { _id: groceryStoreId }] }
    );

    if (!groceryStore)
        throw errors.GROCERY_STORE_NOT_FOUND();

    const { food } = addFoodDTO;
    if (!food)
        throw errors.VALIDATION_ERROR("Food is missing in request.");

    if (!FoodService.exists(food))
        throw errors.FOOD_NOT_FOUND(`Food with id: ${food} doesn't exist`);

    const oldIndex = groceryStore.foods.findIndex(f => f == food);
    if (oldIndex > -1)
        throw errors.FOOD_ALREADY_EXISTS(`Food with id: ${food} already exists in daily plan: ${groceryStore.name}`);

    //Add food to list
    groceryStore.foods.push(food);
    return groceryStore.save();
}

const removeFood = async (groceryStoreId: string, removeFoodDTO: IAddRemoveFoodDTO): Promise<IGroceryStoreModel> => {
    const groceryStore = await GroceryStore.findOne(
        { $and: [{ isDeleted: false }, { _id: groceryStoreId }] }
    );

    if (!groceryStore)
        throw errors.GROCERY_STORE_NOT_FOUND();

    const { food } = removeFoodDTO;
    if (!food)
        throw errors.VALIDATION_ERROR("Food is missing in request.");

    if (!FoodService.exists(food))
        throw errors.FOOD_NOT_FOUND(`Food with id: ${food} doesn't exist`);

    const oldIndex = groceryStore.foods.findIndex(m => m == food);
    if (oldIndex === -1)
        throw errors.FOOD_NOT_FOUND(`Food with id: ${food} doesn't exist in daily plan: ${groceryStore.name}`);

    //Remove food from list
    groceryStore.foods.splice(oldIndex, 1);
    return groceryStore.save();
}

export default {
    exists,
    create,
    getAll,
    getAllDeleted,
    getById,
    deleteById,
    restoreById,
    addFood,
    removeFood
}