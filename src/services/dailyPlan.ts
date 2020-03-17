import { Types } from 'mongoose';
import DailyPlan from '../models/dailyPlan';
import {
  DailyPlanModel,
  DailyPlanCreateDTO,
  AddRemoveMealDTO,
} from '../interfaces/dailyPlan';
import errors from '../helpers/errors';
import BaseService, { QUERIES as BASE_QUERIES } from './base';
import MealService from '../services/meal';
import { MealModel } from '../interfaces/meal';

const QUERIES = {
  ...BASE_QUERIES,
  POPULATE_ALL: {
    path: 'meals',
    match: { isDeleted: false },
    populate: {
      path: 'ingredients.food',
      match: { isDeleted: false },
    },
  },
  POPULATE_MEALS: {
    path: 'meals',
    match: { isDeleted: false },
  },
};

const UpdateDailyPlanTotalValues = (dailyPlan: DailyPlanModel, meal: MealModel, type: 'add' | 'remove') => {
  const c = type === 'add' ? 1 : -1;
  dailyPlan.totalValues.protein += c * meal.totalValues.protein;
  dailyPlan.totalValues.carb += c * meal.totalValues.carb;
  dailyPlan.totalValues.fat += c * meal.totalValues.fat;
  dailyPlan.totalValues.calories += c * meal.totalValues.calories;
};

const Create = async (dailyPlanDTO: DailyPlanCreateDTO): Promise<DailyPlanModel> => {
  const dailyPlanIn: DailyPlanModel = {
    isDeleted: false,
    meals: [],
    totalValues: {
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0,
    },
    ...dailyPlanDTO,
  };

  if (dailyPlanDTO.meals) {
    const promises = dailyPlanDTO.meals.map((meal) => MealService.GetById(meal));
    const mealList = await Promise.all(promises);
    mealList.forEach((meal) => {
      UpdateDailyPlanTotalValues(dailyPlanIn, meal, 'add');
    });
  }

  return new DailyPlan(dailyPlanIn).save();
};

const GetWithMeals = async (dailyPlanId: string | Types.ObjectId): Promise<DailyPlanModel> => {
  const dailyPlan = await DailyPlan.findOne(
    QUERIES.GET_BY_ID(dailyPlanId),
  ).populate(QUERIES.POPULATE_ALL);

  if (!dailyPlan) throw errors.DAILY_PLAN_NOT_FOUND();
  return dailyPlan;
};

const AddMeal = async (
  dailyPlanId: string | Types.ObjectId,
  addMealDTO: AddRemoveMealDTO,
): Promise<DailyPlanModel> => {
  const dailyPlan = await DailyPlan.findOne(
    QUERIES.GET_BY_ID(dailyPlanId),
  );

  if (!dailyPlan) throw errors.DAILY_PLAN_NOT_FOUND();

  const { mealId } = addMealDTO;
  if (!mealId) throw errors.VALIDATION_ERROR('Meal id is missing in request.');

  const oldIndex = dailyPlan.meals.findIndex((m) => m.equals(mealId));
  if (oldIndex > -1) throw errors.MEAL_ALREADY_EXISTS(`Meal with id: ${mealId} already exists in daily plan: ${dailyPlan.name}`);

  const meal = await MealService.GetById(mealId);
  UpdateDailyPlanTotalValues(dailyPlan, meal, 'add');

  // Add mealId to list
  dailyPlan.meals.push(Types.ObjectId(mealId));
  return dailyPlan.save();
};

const RemoveMeal = async (
  dailyPlanId: string | Types.ObjectId,
  removeMealDTO: AddRemoveMealDTO,
): Promise<DailyPlanModel> => {
  const dailyPlan = await DailyPlan.findOne(
    QUERIES.GET_BY_ID(dailyPlanId),
  );

  if (!dailyPlan) throw errors.DAILY_PLAN_NOT_FOUND();

  const { mealId } = removeMealDTO;
  if (!mealId) throw errors.VALIDATION_ERROR('Meal id is missing in request.');

  const oldIndex = dailyPlan.meals.findIndex((m) => m.equals(mealId));
  if (oldIndex === -1) throw errors.MEAL_NOT_FOUND(`Meal with id: ${mealId} doesn't exist in daily plan: ${dailyPlan.name}`);

  const meal = await MealService.GetById(mealId);
  UpdateDailyPlanTotalValues(dailyPlan, meal, 'add');

  // Remove meal from list
  dailyPlan.meals.splice(oldIndex, 1);
  return dailyPlan.save();
};

export default {
  Exists: (id: string | Types.ObjectId) => BaseService.Exists<DailyPlanModel>(id, DailyPlan),
  GetAll: () => BaseService.GetAll<DailyPlanModel>(DailyPlan),
  GetAllDeleted: () => BaseService.GetAllDeleted<DailyPlanModel>(DailyPlan),
  GetById: (id: string | Types.ObjectId) => BaseService.GetById<DailyPlanModel>(id, DailyPlan),
  DeleteById: (
    id: string | Types.ObjectId,
  ) => BaseService.DeleteById<DailyPlanModel>(id, DailyPlan),
  RestoreById: (
    id: string | Types.ObjectId,
  ) => BaseService.RestoreById<DailyPlanModel>(id, DailyPlan),
  Create,
  GetWithMeals,
  AddMeal,
  RemoveMeal,
};
