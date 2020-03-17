import { Types } from 'mongoose';
import Restaurant from '../models/restaurant';
import {
  RestaurantModel,
  RestaurantCreateDTO,
  AddRemoveFoodDTO,
  AddRemoveMealDTO,
} from '../interfaces/restaurant';
import errors from '../helpers/errors';
import BaseService, { QUERIES as BASE_QUERIES } from './base';
import MealService from './meal';
import FoodService from './food';

const QUERIES = {
  ...BASE_QUERIES,
  POPULATE_FOODS: {
    path: 'foods',
    match: { isDeleted: false },
  },
  POPULATE_MEALS: {
    path: 'meals',
    match: { isDeleted: false },
  },
};

const Create = async (restaurantDTO: RestaurantCreateDTO): Promise<RestaurantModel> => {
  if (restaurantDTO.foods) {
    const falseIndex = await FoodService.FindInvalidElement(restaurantDTO.foods);
    if (falseIndex > -1) {
      throw errors.FOOD_NOT_FOUND('Food with id:'
      + `${restaurantDTO.foods[falseIndex]} doesn't exist.`);
    }
  }

  if (restaurantDTO.meals) {
    const falseIndex = await MealService.FindInvalidElement(restaurantDTO.meals);
    if (falseIndex > -1) {
      throw errors.MEAL_NOT_FOUND('Meal with id:'
      + `${restaurantDTO.meals[falseIndex]} doesn't exist.`);
    }
  }

  const restaurantIn: RestaurantModel = {
    foods: [],
    meals: [],
    isDeleted: false,
    ...restaurantDTO,
  };

  return new Restaurant(restaurantIn).save();
};

const AddFood = async (
  restaurantId: string,
  addFoodDTO: AddRemoveFoodDTO,
): Promise<RestaurantModel> => {
  const restaurant = await Restaurant.findOne(
    QUERIES.GET_BY_ID(restaurantId),
  );

  if (!restaurant) throw errors.RESTAURANT_NOT_FOUND();

  const { foodId } = addFoodDTO;
  if (!foodId) throw errors.VALIDATION_ERROR('Food Id is missing in request.');

  const foodExists = await FoodService.Exists(foodId);
  if (!foodExists) throw errors.FOOD_NOT_FOUND(`Food with id: ${foodId} doesn't exist`);

  const oldIndex = restaurant.foods.findIndex((f) => f.equals(foodId));
  if (oldIndex > -1) {
    throw errors.FOOD_ALREADY_EXISTS(
      `Food with id: ${foodId} already exists in restaurant: ${restaurant.name}`,
    );
  }

  // Add foodId to list
  restaurant.foods.push(Types.ObjectId(foodId));
  return restaurant.save();
};

const RemoveFood = async (
  restaurantId: string,
  removeFoodDTO: AddRemoveFoodDTO,
): Promise<RestaurantModel> => {
  const restaurant = await Restaurant.findOne(
    QUERIES.GET_BY_ID(restaurantId),
  );

  if (!restaurant) throw errors.RESTAURANT_NOT_FOUND();

  const { foodId } = removeFoodDTO;
  if (!foodId) throw errors.VALIDATION_ERROR('Food is missing in request.');

  const foodExists = await FoodService.Exists(foodId);
  if (!foodExists) throw errors.FOOD_NOT_FOUND(`Food with id: ${foodId} doesn't exist`);

  const oldIndex = restaurant.foods.findIndex((f) => f.equals(foodId));
  if (oldIndex === -1) {
    throw errors.FOOD_NOT_FOUND(
      `Food with id: ${foodId} doesn't exist in restaurant: ${restaurant.name}`,
    );
  }

  // Remove foodId from list
  restaurant.foods.splice(oldIndex, 1);
  return restaurant.save();
};

const AddMeal = async (
  restaurantId: string,
  addMealDTO: AddRemoveMealDTO,
): Promise<RestaurantModel> => {
  const restaurant = await Restaurant.findOne(
    QUERIES.GET_BY_ID(restaurantId),
  );

  if (!restaurant) throw errors.RESTAURANT_NOT_FOUND();

  const { mealId } = addMealDTO;
  if (!mealId) throw errors.VALIDATION_ERROR('Meal is missing in request.');

  const mealExists = await MealService.Exists(mealId);
  if (!mealExists) throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist`);

  const oldIndex = restaurant.meals.findIndex((m) => m.equals(mealId));
  if (oldIndex > -1) {
    throw errors.MEAL_ALREADY_EXISTS(
      `Meal with id: ${mealId} already exists in restaurant: ${restaurant.name}`,
    );
  }

  // Add mealId to list
  restaurant.meals.push(Types.ObjectId(mealId));
  return restaurant.save();
};

const RemoveMeal = async (
  restaurantId: string,
  removeMealDTO: AddRemoveMealDTO,
): Promise<RestaurantModel> => {
  const restaurant = await Restaurant.findOne(
    QUERIES.GET_BY_ID(restaurantId),
  );

  if (!restaurant) throw errors.RESTAURANT_NOT_FOUND();

  const { mealId } = removeMealDTO;
  if (!mealId) throw errors.VALIDATION_ERROR('Meal is missing in request.');

  const mealExists = await MealService.Exists(mealId);
  if (!mealExists) throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist`);

  const oldIndex = restaurant.meals.findIndex((m) => m.equals(mealId));
  if (oldIndex === -1) {
    throw errors.MEAL_NOT_FOUND(
      `Meal with id: ${mealId} doesn't exist in restaurant: ${restaurant.name}`,
    );
  }

  // Remove mealId from list
  restaurant.meals.splice(oldIndex, 1);
  return restaurant.save();
};

export default {
  Exists: (id: string | Types.ObjectId) => BaseService.Exists<RestaurantModel>(id, Restaurant),
  GetAll: () => BaseService.GetAll<RestaurantModel>(Restaurant),
  GetAllDeleted: () => BaseService.GetAllDeleted<RestaurantModel>(Restaurant),
  GetById: (id: string | Types.ObjectId) => BaseService.GetById<RestaurantModel>(id, Restaurant),
  DeleteById: (
    id: string | Types.ObjectId,
  ) => BaseService.DeleteById<RestaurantModel>(id, Restaurant),
  RestoreById: (
    id: string | Types.ObjectId,
  ) => BaseService.RestoreById<RestaurantModel>(id, Restaurant),
  Create,
  AddMeal,
  RemoveMeal,
  AddFood,
  RemoveFood,
};
