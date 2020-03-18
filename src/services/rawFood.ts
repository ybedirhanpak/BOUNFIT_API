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
  if (!rawFoodDTO.name) throw errors.VALIDATION_ERROR('There must be a name of the raw food');
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

const UpdateById = async (
  foodId: string | Types.ObjectId,
  updateDTO: RawFoodUpdateDTO,
): Promise<RawFoodModel> => {
  const rawFood = await RawFood.findOne(
    QUERIES.GET_BY_ID(foodId),
  );
  if (!rawFood) throw errors.RAW_FOOD_NOT_FOUND();

  if (updateDTO.protein && updateDTO.protein < 0) throw errors.INVALID_RAW_FOOD('Protein cannot be less than zero.');
  if (updateDTO.carb && updateDTO.carb < 0) throw errors.INVALID_RAW_FOOD('Carb cannot be less than zero.');
  if (updateDTO.fat && updateDTO.fat < 0) throw errors.INVALID_RAW_FOOD('Fat cannot be less than zero.');
  if (updateDTO.calories && updateDTO.calories < 0) throw errors.INVALID_RAW_FOOD('Calories cannot be less than zero.');
  if (updateDTO.name && updateDTO.name.length > 100) {
    throw errors.INVALID_RAW_FOOD('Name cannot exceed 100 characters.');
  }

  rawFood.set(updateDTO);
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
