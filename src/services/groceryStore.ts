import { Types } from 'mongoose';
import GroceryStore from '../models/groceryStore';
import {
  GroceryStoreModel,
  GroceryStoreCreateDTO,
  AddRemoveRawFoodDTO,
} from '../interfaces/groceryStore';
import errors from '../helpers/errors';
import BaseService, { QUERIES as BASE_QUERIES } from './base';
import RawFoodService from './rawFood';

const QUERIES = {
  ...BASE_QUERIES,
  POPULATE_RAW_FOODS: {
    path: 'foods',
    match: { isDeleted: false },
  },
};

const Create = async (groceryStoreDTO: GroceryStoreCreateDTO): Promise<GroceryStoreModel> => {
  const groceryStoreIn: GroceryStoreModel = {
    rawFoods: [],
    isDeleted: false,
    ...groceryStoreDTO,
  };

  if (groceryStoreDTO.rawFoods) {
    const falseIndex = await RawFoodService.FindInvalidElement(groceryStoreDTO.rawFoods);
    if (falseIndex > -1) {
      throw errors.RAW_FOOD_NOT_FOUND('Raw food with id:'
      + `${groceryStoreDTO.rawFoods[falseIndex]} doesn't exist.`);
    }
  }

  return new GroceryStore(groceryStoreIn).save();
};

const GetWithRawFoods = async (
  groceryStoreId: string | Types.ObjectId,
): Promise<GroceryStoreModel> => {
  const groceryStore = await GroceryStore.findOne(
    QUERIES.GET_BY_ID(groceryStoreId),
  ).populate(QUERIES.POPULATE_RAW_FOODS);

  if (!groceryStore) throw errors.GROCERY_STORE_NOT_FOUND();
  return groceryStore;
};

const AddRawFood = async (
  groceryStoreId: string | Types.ObjectId,
  addFoodDTO: AddRemoveRawFoodDTO,
): Promise<GroceryStoreModel> => {
  const groceryStore = await GroceryStore.findOne(
    QUERIES.GET_BY_ID(groceryStoreId),
  );

  if (!groceryStore) throw errors.GROCERY_STORE_NOT_FOUND();

  const { rawFoodId } = addFoodDTO;
  if (!rawFoodId) throw errors.VALIDATION_ERROR('Raw food is missing in request.');

  const rawFoodExists = await RawFoodService.Exists(rawFoodId);
  if (!rawFoodExists) throw errors.RAW_FOOD_NOT_FOUND(`Raw food with id: ${rawFoodId} doesn't exist`);

  const oldIndex = groceryStore.rawFoods.findIndex((f) => f.equals(rawFoodId));
  if (oldIndex > -1) {
    throw errors.FOOD_ALREADY_EXISTS(`Raw food with id: ${rawFoodId} already exists`
  + `in grocery store: ${groceryStore.name}`);
  }

  // Add food to list
  groceryStore.rawFoods.push(Types.ObjectId(rawFoodId));
  return groceryStore.save();
};

const RemoveRawFood = async (
  groceryStoreId: string | Types.ObjectId,
  removeFoodDTO: AddRemoveRawFoodDTO,
): Promise<GroceryStoreModel> => {
  const groceryStore = await GroceryStore.findOne(
    QUERIES.GET_BY_ID(groceryStoreId),
  );

  if (!groceryStore) throw errors.GROCERY_STORE_NOT_FOUND();

  const { rawFoodId } = removeFoodDTO;
  if (!rawFoodId) throw errors.VALIDATION_ERROR('Raw food is missing in request.');

  const rawFoodExists = await RawFoodService.Exists(rawFoodId);
  if (!rawFoodExists) throw errors.RAW_FOOD_NOT_FOUND(`Raw food with id: ${rawFoodId} doesn't exist`);

  const oldIndex = groceryStore.rawFoods.findIndex((r) => r.equals(rawFoodId));
  if (oldIndex === -1) {
    throw errors.RAW_FOOD_NOT_FOUND(`Raw food with id: ${rawFoodId} doesn't exist`
  + ` in grocery store: ${groceryStore.name}`);
  }

  // Remove food from list
  groceryStore.rawFoods.splice(oldIndex, 1);
  return groceryStore.save();
};

export default {
  Exists: (id: string | Types.ObjectId) => BaseService.Exists<GroceryStoreModel>(id, GroceryStore),
  GetAll: () => BaseService.GetAll<GroceryStoreModel>(GroceryStore),
  GetAllDeleted: () => BaseService.GetAllDeleted<GroceryStoreModel>(GroceryStore),
  GetById: (
    id: string | Types.ObjectId,
  ) => BaseService.GetById<GroceryStoreModel>(id, GroceryStore),
  DeleteById: (
    id: string | Types.ObjectId,
  ) => BaseService.DeleteById<GroceryStoreModel>(id, GroceryStore),
  RestoreById: (
    id: string | Types.ObjectId,
  ) => BaseService.RestoreById<GroceryStoreModel>(id, GroceryStore),
  Create,
  GetWithRawFoods,
  AddRawFood,
  RemoveRawFood,
};
