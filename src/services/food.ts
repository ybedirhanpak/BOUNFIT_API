import { Schema } from "mongoose";
import Food from "../models/food";
import {
    IFoodModel,
    IFoodCreateDTO,
    IFoodUpdateDTO
} from "../interfaces/food";
import errors from "../helpers/errors";

const exists = async (foodId: string | Schema.Types.ObjectId): Promise<boolean> => {
    return Food.exists({ $and: [{ isDeleted: false }, { _id: foodId }] });
}

const create = async (foodDTO: IFoodCreateDTO): Promise<IFoodModel> => {
    if (foodDTO.protein < 0)
        throw errors.INVALID_FOOD("Protein cannot be less than zero.");
    if (foodDTO.carb < 0)
        throw errors.INVALID_FOOD("Carb cannot be less than zero.");
    if (foodDTO.fat < 0)
        throw errors.INVALID_FOOD("Fat cannot be less than zero.");
    if (foodDTO.calories < 0)
        throw errors.INVALID_FOOD("Calories cannot be less than zero.");
    if (foodDTO.name.length > 100) {
        throw errors.INVALID_FOOD("Name cannot exceed 100 characters.");
    }

    const foodIn: IFoodModel = {
        ...foodDTO,
        isDeleted: false
    };
    return new Food(foodIn).save();
}

const getAll = async (): Promise<IFoodModel[]> => {
    return Food.find({ isDeleted: false });
}

const getAllDeleted = async (): Promise<IFoodModel[]> => {
    return Food.find({ isDeleted: true });
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

    if (foodUpdateDTO.protein && foodUpdateDTO.protein < 0)
        throw errors.INVALID_FOOD("Protein cannot be less than zero.");
    if (foodUpdateDTO.carb && foodUpdateDTO.carb < 0)
        throw errors.INVALID_FOOD("Carb cannot be less than zero.");
    if (foodUpdateDTO.fat && foodUpdateDTO.fat < 0)
        throw errors.INVALID_FOOD("Fat cannot be less than zero.");
    if (foodUpdateDTO.calories && foodUpdateDTO.calories < 0)
        throw errors.INVALID_FOOD("Calories cannot be less than zero.");
    if (foodUpdateDTO.name && foodUpdateDTO.name.length > 100) {
        throw errors.INVALID_FOOD("Name cannot exceed 100 characters.");
    }

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