import { Schema } from "mongoose";
import Food from "../models/food";
import {
    IFoodModel,
    IFoodCreateDTO,
    IFoodUpdateDTO
} from "../interfaces/food";
import errors from "../helpers/errors";

const QUERIES = {
    GET_BY_ID: (id: string | Schema.Types.ObjectId) => ({ $and: [{ isDeleted: false }, { _id: id }] }),
    GET_DELETED_BY_ID: (id: string | Schema.Types.ObjectId) => ({ $and: [{ isDeleted: true }, { _id: id }] }),
    NOT_DELETED: { isDeleted: false },
    DELETED: { isDeleted: true }
}

const exists = async (foodId: string | Schema.Types.ObjectId): Promise<boolean> => {
    return Food.exists(QUERIES.GET_BY_ID(foodId));
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
    return Food.find(QUERIES.NOT_DELETED);
}

const getAllDeleted = async (): Promise<IFoodModel[]> => {
    return Food.find(QUERIES.DELETED);
}

const getById = async (foodId: string | Schema.Types.ObjectId): Promise<IFoodModel> => {
    const food = await Food.findOne(
        QUERIES.GET_BY_ID(foodId)
    )
    if (!food)
        throw errors.FOOD_NOT_FOUND();
    return food;
}

const updateById = async (foodId: string | Schema.Types.ObjectId,
    foodUpdateDTO: IFoodUpdateDTO): Promise<IFoodModel> => {
    const food = await Food.findOne(
        QUERIES.GET_BY_ID(foodId)
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

const deleteById = async (foodId: string | Schema.Types.ObjectId): Promise<IFoodModel> => {
    const food = await Food.findOne(
        QUERIES.GET_BY_ID(foodId)
    )
    if (!food)
        throw errors.FOOD_NOT_FOUND();
    food.isDeleted = true;
    return food.save();
}

const restoreById = async (foodId: string | Schema.Types.ObjectId): Promise<IFoodModel> => {
    const food = await Food.findOne(
        QUERIES.GET_DELETED_BY_ID(foodId)
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