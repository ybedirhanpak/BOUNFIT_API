import mongoose, { Schema } from 'mongoose';
import Food from '../models/food';
import {
  FoodModel,
  FoodCreateDTO,
  AddIngredientDTO,
  RemoveIngredientDTO,
  UpdateIngredientDTO,
} from '../interfaces/food';
import errors from '../helpers/errors';
import BaseService, { QUERIES as BASE_QUERIES } from './base';
import RawFoodService from './rawFood';
import { Ingredient } from '../interfaces/ingredient';
import { RawFoodModel } from '../interfaces/rawFood';

const QUERIES = {
  ...BASE_QUERIES,
};

const UpdateFoodTotalValues = (
  food: FoodModel,
  rawFood: RawFoodModel,
  quantity: number,
  type: 'add' | 'remove',
) => {
  const c = type === 'add' ? 1 : -1;
  food.total.values.protein += c * rawFood.protein * (quantity / 100);
  food.total.values.carb += c * rawFood.carb * (quantity / 100);
  food.total.values.fat += c * rawFood.fat * (quantity / 100);
  food.total.values.calories += c * rawFood.calories * (quantity / 100);
};

const Create = async (foodDTO: FoodCreateDTO): Promise<FoodModel> => {
  const foodIn: FoodModel = {
    isDeleted: false,
    total: {
      values: {
        protein: 0,
        carb: 0,
        fat: 0,
        calories: 0,
      },
      quantity: 0,
    },
    ingredients: [],
    ...foodDTO,
  };

  if (foodDTO.ingredients) {
    const quantityList: number[] = [];
    const promises = foodDTO.ingredients.map((ingredient) => {
      quantityList.push(ingredient.quantity);
      return RawFoodService.GetById(ingredient.rawFood);
    });

    const rawFoods = await Promise.all(promises);

    rawFoods.forEach((rawFood, index) => {
      UpdateFoodTotalValues(foodIn, rawFood, quantityList[index], 'add');
    });
  }

  return new Food(foodIn).save();
};

const AddIngredient = async (foodId: string | mongoose.Types.ObjectId,
  addIngredientDTO: AddIngredientDTO): Promise<FoodModel> => {
  const food = await Food.findOne(
    QUERIES.GET_BY_ID(foodId),
  );

  if (!food) throw errors.FOOD_NOT_FOUND(`Food with id: ${foodId} doesn't exist.`);

  const { ingredient } = addIngredientDTO;
  if (!ingredient) throw errors.INVALID_INGREDIENT('Ingredient object is missing in request.');

  if (!ingredient.rawFood) throw errors.INVALID_INGREDIENT('RawFood in ingredient object is missing.');

  if (!ingredient.quantity) {
    throw errors.INVALID_INGREDIENT('Quantity in ingredient object is missing.');
  }

  if (ingredient.quantity <= 0) {
    throw errors.INVALID_INGREDIENT('Quantity cannot be less than zero.');
  }

  const rawFoodExists = await RawFoodService.Exists(ingredient.rawFood);
  if (!rawFoodExists) throw errors.RAW_FOOD_NOT_FOUND(`Raw food with id: ${ingredient.rawFood} doesn't exist.`);

  const oldIndex = food.ingredients.findIndex(
    (i) => mongoose.Types.ObjectId(ingredient.rawFood).equals(i.rawFood),
  );

  if (oldIndex === -1) {
    const ingredientUpdate: Ingredient = {
      quantity: ingredient.quantity,
      rawFood: mongoose.Types.ObjectId(ingredient.rawFood),
    };
    food.ingredients.push(ingredientUpdate);
  } else {
    // If ingredient already exists, increase its quantity
    const ingredientOld = food.ingredients[oldIndex];
    ingredientOld.quantity += ingredient.quantity;
  }

  food.total.quantity += ingredient.quantity;
  const rawFood = await RawFoodService.GetById(ingredient.rawFood);
  UpdateFoodTotalValues(food, rawFood, ingredient.quantity, 'add');

  return food.save();
};

const UpdateIngredient = async (foodId: string | mongoose.Types.ObjectId,
  updateIngredientDTO: UpdateIngredientDTO): Promise<FoodModel> => {
  const food = await Food.findOne(
    QUERIES.GET_BY_ID(foodId),
  );

  if (!food) throw errors.FOOD_NOT_FOUND(`Food with id: ${foodId} doesn't exist.`);

  const { ingredientId, quantity } = updateIngredientDTO;

  const oldIndex = food.ingredients.findIndex(
    (i) => mongoose.Types.ObjectId(ingredientId).equals(i.rawFood),
  );

  // If ingredient doesn't exists in the list, throw error
  if (oldIndex === -1) {
    throw errors.INGREDIENT_NOT_FOUND(`Ingredient with id: ${ingredientId} `
            + `doesn't exist in ingredients list of food: ${food.name}.`);
  }

  const ingredient = food.ingredients[oldIndex];

  if (quantity) {
    if (quantity < 0) throw errors.INVALID_INGREDIENT('Quantity cannot be less than zero.');

    const rawFood = await RawFoodService.GetById(ingredient.rawFood);
    UpdateFoodTotalValues(food, rawFood, quantity - ingredient.quantity, 'add');
    food.total.quantity += quantity - ingredient.quantity;
    ingredient.quantity = quantity;
  }

  return food.save();
};

const RemoveIngredient = async (foodId: string | mongoose.Types.ObjectId,
  removeIngredientDTO: RemoveIngredientDTO): Promise<FoodModel> => {
  const food = await Food.findOne(
    QUERIES.GET_BY_ID(foodId),
  );

  if (!food) throw errors.FOOD_NOT_FOUND(`Food with id: ${foodId} doesn't exist.`);

  const { ingredientId } = removeIngredientDTO;

  if (!ingredientId) throw errors.INVALID_INGREDIENT('Ingredient id is missing in request.');

  const oldIndex = food.ingredients.findIndex(
    (i) => mongoose.Types.ObjectId(ingredientId).equals(i.rawFood),
  );

  // If ingredient doesn't exists in the list, throw error
  if (oldIndex === -1) {
    throw errors.INGREDIENT_NOT_FOUND(`Ingredient with id: ${ingredientId} `
            + `doesn't exist in ingredients list of food: ${food.name}.`);
  }

  const ingredient = food.ingredients[oldIndex];

  const rawFood = await RawFoodService.GetById(ingredient.rawFood);
  UpdateFoodTotalValues(food, rawFood, ingredient.quantity, 'remove');
  food.total.quantity -= ingredient.quantity;

  // Remove ingredient from list
  food.ingredients.splice(oldIndex, 1);

  return food.save();
};

export default {
  Exists: (id: string | mongoose.Types.ObjectId) => BaseService.Exists<FoodModel>(id, Food),
  GetAll: () => BaseService.GetAll<FoodModel>(Food),
  GetAllDeleted: () => BaseService.GetAllDeleted<FoodModel>(Food),
  GetById: (id: string | mongoose.Types.ObjectId) => BaseService.GetById<FoodModel>(id, Food),
  DeleteById:
      (id: string | mongoose.Types.ObjectId) => BaseService.DeleteById<FoodModel>(id, Food),
  RestoreById:
      (id: string | mongoose.Types.ObjectId) => BaseService.RestoreById<FoodModel>(id, Food),
  Create,
  AddIngredient,
  UpdateIngredient,
  RemoveIngredient,
};
