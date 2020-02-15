import { Schema } from "mongoose";
import Food from "../models/food";
import {
    IFoodModel,
    IFoodCreateDTO,
    IFoodUpdateDTO
} from "../interfaces/food";
import errors from "../helpers/errors";

export const isFoodValid = (food: Schema.Types.ObjectId): boolean => {
    let result = false;
    Food.exists({ $and: [{ isDeleted: false }, { _id: food }] }, (err, res) => {
        if (!err)
            result = res;
    });
    return result;
}

const exists = async (foodId: string | Schema.Types.ObjectId): Promise<boolean> => {
    return await Food.exists({ $and: [{ isDeleted: false }, { _id: foodId }] });
}

const create = async (foodDTO: IFoodCreateDTO): Promise<IFoodModel> => {
    const foodIn: IFoodModel = {
        ...foodDTO,
        isDeleted: false
    };
    return await new Food(foodIn).save();
}

const getAll = async (): Promise<IFoodModel[]> => {
    return await Food.find({ isDeleted: false });
}

const getAllDeleted = async (): Promise<IFoodModel[]> => {
    return await Food.find({ isDeleted: true });
}

const getById = async (foodId: string): Promise<IFoodModel> => {
    const food = await Food.findOne(
        { $and: [{ isDeleted: false }, { _id: foodId }] }
    )
    if (!food)
        throw errors.FOOD_NOT_FOUND();
    return food;
}

const updateById = async (foodId: string, foodUpdateDTO: IFoodUpdateDTO): Promise<IFoodModel> => {
    const food = await Food.findOne(
        { $and: [{ isDeleted: false }, { _id: foodId }] }
    )
    if (!food)
        throw errors.FOOD_NOT_FOUND();
    food.set(foodUpdateDTO);
    return food.save();
}

const deleteById = async (foodId: string): Promise<IFoodModel> => {
    const food = await Food.findOne(
        { $and: [{ isDeleted: false }, { _id: foodId }] }
    )
    if (!food)
        throw errors.FOOD_NOT_FOUND();
    food.isDeleted = true;
    return food.save();
}

const restoreById = async (foodId: string): Promise<IFoodModel> => {
    const food = await Food.findOne(
        { $and: [{ isDeleted: true }, { _id: foodId }] }
    )
    if (!food)
        throw errors.FOOD_NOT_FOUND();
    food.isDeleted = false;
    return food.save();
}

export default {
    exists,
    create,
    getAll,
    getAllDeleted,
    getById,
    updateById,
    deleteById,
    restoreById
}