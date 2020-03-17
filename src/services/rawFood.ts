import { Types } from 'mongoose';
import RawFood from '../models/rawFood';
import {
  RawFoodModel,
  RawFoodCreateDTO,
  RawFoodUpdateDTO,
} from '../interfaces/rawFood';
import errors from '../helpers/errors';
import BaseService, { QUERIES as BASE_QUERIES } from './base';

const QUERIES = {
  ...BASE_QUERIES,
};

const Create = async (rawFoodDTO: RawFoodCreateDTO): Promise<RawFoodModel> => {
  if (rawFoodDTO.protein < 0) throw errors.INVALID_RAW_FOOD('Protein cannot be less than zero.');
  if (rawFoodDTO.carb < 0) throw errors.INVALID_RAW_FOOD('Carb cannot be less than zero.');
  if (rawFoodDTO.fat < 0) throw errors.INVALID_RAW_FOOD('Fat cannot be less than zero.');
  if (rawFoodDTO.calories < 0) throw errors.INVALID_RAW_FOOD('Calories cannot be less than zero.');
  if (rawFoodDTO.name.length > 100) {
    throw errors.INVALID_RAW_FOOD('Name cannot exceed 100 characters.');
  }

  const rawFoodIn: RawFoodModel = {
    isDeleted: false,
    ...rawFoodDTO,
  };
  return new RawFood(rawFoodIn).save();
};

const UpdateById = async (foodId: string | Types.ObjectId,
  foodUpdateDTO: RawFoodUpdateDTO): Promise<RawFoodModel> => {
  const rawFood = await RawFood.findOne(
    QUERIES.GET_BY_ID(foodId),
  );
  if (!rawFood) throw errors.FOOD_NOT_FOUND();

  if (foodUpdateDTO.protein && foodUpdateDTO.protein < 0) throw errors.INVALID_RAW_FOOD('Protein cannot be less than zero.');
  if (foodUpdateDTO.carb && foodUpdateDTO.carb < 0) throw errors.INVALID_RAW_FOOD('Carb cannot be less than zero.');
  if (foodUpdateDTO.fat && foodUpdateDTO.fat < 0) throw errors.INVALID_RAW_FOOD('Fat cannot be less than zero.');
  if (foodUpdateDTO.calories && foodUpdateDTO.calories < 0) throw errors.INVALID_RAW_FOOD('Calories cannot be less than zero.');
  if (foodUpdateDTO.name && foodUpdateDTO.name.length > 100) {
    throw errors.INVALID_RAW_FOOD('Name cannot exceed 100 characters.');
  }

  rawFood.set(foodUpdateDTO);
  return rawFood.save();
};

export default {
  Exists: (id: string | Types.ObjectId) => BaseService.Exists<RawFoodModel>(id, RawFood),
  FindInvalidElement: (list: Types.ObjectId[]) => BaseService.FindInvalidElement(list, RawFood),
  GetAll: () => BaseService.GetAll<RawFoodModel>(RawFood),
  GetAllDeleted: () => BaseService.GetAllDeleted<RawFoodModel>(RawFood),
  GetById: (id: string | Types.ObjectId) => BaseService.GetById<RawFoodModel>(id, RawFood),
  DeleteById: (id: string | Types.ObjectId) => BaseService.DeleteById<RawFoodModel>(id, RawFood),
  RestoreById: (id: string | Types.ObjectId) => BaseService.RestoreById<RawFoodModel>(id, RawFood),
  Create,
  UpdateById,
};
