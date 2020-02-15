import { Schema } from "mongoose";
import DailyPlan from "../models/dailyPlan";
import {
    IDailyPlanModel,
    IDailyPlanCreateDTO,
    IAddRemoveMealDTO
} from "../interfaces/dailyPlan";
import errors from "../helpers/errors";
import MealService from "../services/meal";

const exists = async (dailyPlanId: string | Schema.Types.ObjectId): Promise<boolean> => {
    return await DailyPlan.exists({ $and: [{ isDeleted: false }, { _id: dailyPlanId }] });
}

const create = async (dailyPlanDTO: IDailyPlanCreateDTO): Promise<IDailyPlanModel> => {
    const dailyPlanIn: IDailyPlanModel = {
        ...dailyPlanDTO,
        isDeleted: false
    };
    return await new DailyPlan(dailyPlanIn).save();
}

const getAll = async (): Promise<IDailyPlanModel[]> => {
    return await DailyPlan.find({ isDeleted: false });
}

const getAllDeleted = async (): Promise<IDailyPlanModel[]> => {
    return await DailyPlan.find({ isDeleted: true });
}

const getById = async (dailyPlanId: string): Promise<IDailyPlanModel> => {
    const dailyPlan = await DailyPlan.findOne(
        { $and: [{ isDeleted: false }, { _id: dailyPlanId }] }
    )
    if (!dailyPlan)
        throw errors.DAILY_PLAN_NOT_FOUND();
    return dailyPlan;
}

const deleteById = async (dailyPlanId: string): Promise<IDailyPlanModel> => {
    const dailyPlan = await DailyPlan.findOne(
        { $and: [{ isDeleted: false }, { _id: dailyPlanId }] }
    )
    if (!dailyPlan)
        throw errors.DAILY_PLAN_NOT_FOUND();
    dailyPlan.isDeleted = true;
    return dailyPlan.save();
}

const restoreById = async (dailyPlanId: string): Promise<IDailyPlanModel> => {
    const dailyPlan = await DailyPlan.findOne(
        { $and: [{ isDeleted: true }, { _id: dailyPlanId }] }
    )
    if (!dailyPlan)
        throw errors.DAILY_PLAN_NOT_FOUND();
    dailyPlan.isDeleted = false;
    return dailyPlan.save();
}

const addMeal = async (dailyPlanId: string, addMealDTO: IAddRemoveMealDTO): Promise<IDailyPlanModel> => {
    const dailyPlan = await DailyPlan.findOne(
        { $and: [{ isDeleted: false }, { _id: dailyPlanId }] }
    );

    if (!dailyPlan)
        throw errors.DAILY_PLAN_NOT_FOUND();

    const { meal } = addMealDTO;
    if (!meal)
        throw errors.VALIDATION_ERROR("Meal is missing in request.");

    if (!MealService.exists(meal))
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${meal} doesn't exist`);

    const oldIndex = dailyPlan.meals.findIndex(m => m == meal);
    if (oldIndex > -1)
        throw errors.MEAL_ALREADY_EXISTS(`Meal with id: ${meal} already exists in daily plan: ${dailyPlan.name}`);

    //Add meal to list
    dailyPlan.meals.push(meal);
    return dailyPlan.save();
}

const removeMeal = async (dailyPlanId: string, removeMealDTO: IAddRemoveMealDTO): Promise<IDailyPlanModel> => {
    const dailyPlan = await DailyPlan.findOne(
        { $and: [{ isDeleted: false }, { _id: dailyPlanId }] }
    );

    if (!dailyPlan)
        throw errors.DAILY_PLAN_NOT_FOUND();

    const { meal } = removeMealDTO;
    if (!meal)
        throw errors.VALIDATION_ERROR("Meal is missing in request.");

    if (!MealService.exists(meal))
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${meal} doesn't exist`);

    const oldIndex = dailyPlan.meals.findIndex(m => m == meal);
    if (oldIndex === -1)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${meal} doesn't exist in daily plan: ${dailyPlan.name}`);

    //Remove meal from list
    dailyPlan.meals.splice(oldIndex, 1);
    return dailyPlan.save();
}

export default {
    exists,
    create,
    getAll,
    getAllDeleted,
    getById,
    deleteById,
    restoreById,
    addMeal,
    removeMeal
}