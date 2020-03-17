import { Types } from 'mongoose';
import Meal from '../models/meal';
import {
  MealModel,
  MealCreateDTO,
  AddRemoveFoodDTO,
} from '../interfaces/meal';
import errors from '../helpers/errors';
import FoodService from '../services/food';
import BaseService, { QUERIES as BASE_QUERIES } from './base';
import { FoodModel } from '../interfaces/food';

const QUERIES = {
  ...BASE_QUERIES,
  POPULATE_FOODS: {
    path: 'foods',
    match: { isDeleted: false },
  },
};

const UpdateMealTotalValues = (meal: MealModel, food: FoodModel, type: 'add' | 'remove') => {
  const c = type === 'add' ? 1 : -1;
  meal.totalValues.protein += c * food.total.values.protein;
  meal.totalValues.carb += c * food.total.values.carb;
  meal.totalValues.fat += c * food.total.values.fat;
  meal.totalValues.calories += c * food.total.values.calories;
};

const Create = async (mealCreateDTO: MealCreateDTO): Promise<MealModel> => {
  const mealIn: MealModel = {
    isDeleted: false,
    foods: [],
    totalValues: {
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0,
    },
    ...mealCreateDTO,
  };

  if (mealCreateDTO.foods) {
    const promises = mealCreateDTO.foods.map((food) => FoodService.GetById(food));
    const foodList = await Promise.all(promises);
    foodList.forEach((food) => {
      UpdateMealTotalValues(mealIn, food, 'add');
    });
  }

  return new Meal(mealIn).save();
};

const GetWithFoods = async (mealId: string | Types.ObjectId): Promise<MealModel> => {
  const meal = await Meal.findOne(
    QUERIES.GET_BY_ID(mealId),
  ).populate(QUERIES.POPULATE_FOODS);

  if (!meal) throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

  return meal;
};

const AddFood = async (
  mealId: string | Types.ObjectId,
  addFoodDTO: AddRemoveFoodDTO,
): Promise<MealModel> => {
  const meal = await Meal.findOne(
    QUERIES.GET_BY_ID(mealId),
  );

  if (!meal) throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

  const { foodId } = addFoodDTO;

  const food = await FoodService.GetById(foodId);
  UpdateMealTotalValues(meal, food, 'add');

  meal.foods.push(Types.ObjectId(foodId));

  return meal.save();
};

const RemoveFood = async (
  mealId: string | Types.ObjectId,
  removeFoodDTO: AddRemoveFoodDTO,
): Promise<MealModel> => {
  const meal = await Meal.findOne(
    QUERIES.GET_BY_ID(mealId),
  );

  if (!meal) throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist.`);

  const { foodId } = removeFoodDTO;

  const food = await FoodService.GetById(foodId);
  UpdateMealTotalValues(meal, food, 'remove');

  const index = meal.foods.findIndex((f) => f.equals(foodId));
  meal.foods.splice(index, 1);

  return meal.save();
};

export default {
  Exists: (id: string | Types.ObjectId) => BaseService.Exists<MealModel>(id, Meal),
  FindInvalidElement: (list: Types.ObjectId[]) => BaseService.FindInvalidElement(list, Meal),
  GetAll: () => BaseService.GetAll<MealModel>(Meal),
  GetAllDeleted: () => BaseService.GetAllDeleted<MealModel>(Meal),
  GetById: (
    id: string | Types.ObjectId,
  ) => BaseService.GetById<MealModel>(id, Meal),
  DeleteById: (
    id: string | Types.ObjectId,
  ) => BaseService.DeleteById<MealModel>(id, Meal),
  RestoreById: (
    id: string | Types.ObjectId,
  ) => BaseService.RestoreById<MealModel>(id, Meal),
  Create,
  GetWithFoods,
  AddFood,
  RemoveFood,
};
