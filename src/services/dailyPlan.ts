import { Schema } from "mongoose";
import DailyPlan from "../models/dailyPlan";
import {
    IDailyPlanModel,
    IDailyPlanCreateDTO,
    IAddRemoveMealDTO
} from "../interfaces/dailyPlan";
import errors from "../helpers/errors";
import MealService from "../services/meal";

const QUERIES = {
    GET_BY_ID: (id: string | Schema.Types.ObjectId) => ({ $and: [{ isDeleted: false }, { _id: id }] }),
    GET_DELETED_BY_ID: (id: string | Schema.Types.ObjectId) => ({ $and: [{ isDeleted: true }, { _id: id }] }),
    NOT_DELETED: { isDeleted: false },
    DELETED: { isDeleted: true },
    POPULATE_ALL: {
        path: "meals",
        match: { isDeleted: false },
        populate: {
            path: "ingredients.food",
            match: { isDeleted: false }
        }
    },
    POPULATE_MEALS: {
        path: "meals",
        match: { isDeleted: false }
    }
}

const exists = async (dailyPlanId: string | Schema.Types.ObjectId): Promise<boolean> => {
    return DailyPlan.exists(QUERIES.GET_BY_ID(dailyPlanId));
}

const create = async (dailyPlanDTO: IDailyPlanCreateDTO): Promise<IDailyPlanModel> => {
    const dailyPlanIn: IDailyPlanModel = {
        meals: [],
        isDeleted: false,
        ...dailyPlanDTO
    };

    //Check if there are any invalid meals.
    let invalidMeal = null;
    for (let i = 0; i < dailyPlanIn.meals.length; i++) {
        const mealExists = await MealService.exists(dailyPlanIn.meals[i]);
        if (!mealExists) {
            invalidMeal = dailyPlanIn.meals[i];
            break;
        }
    }

    if (invalidMeal)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${invalidMeal} doesn't exists.`);

    return new DailyPlan(dailyPlanIn).save();
}

const getAll = async (): Promise<IDailyPlanModel[]> => {
    return DailyPlan.find(QUERIES.NOT_DELETED)
        .populate(QUERIES.POPULATE_MEALS);
}

const getAllDeleted = async (): Promise<IDailyPlanModel[]> => {
    return DailyPlan.find(QUERIES.DELETED);
}

const getById = async (dailyPlanId: string | Schema.Types.ObjectId): Promise<IDailyPlanModel> => {
    const dailyPlan = await DailyPlan.findOne(
        QUERIES.GET_BY_ID(dailyPlanId)
    ).populate(QUERIES.POPULATE_ALL);

    if (!dailyPlan)
        throw errors.DAILY_PLAN_NOT_FOUND();
    return dailyPlan;
}

const deleteById = async (dailyPlanId: string | Schema.Types.ObjectId): Promise<IDailyPlanModel> => {
    const dailyPlan = await DailyPlan.findOne(
        QUERIES.GET_BY_ID(dailyPlanId)
    )
    if (!dailyPlan)
        throw errors.DAILY_PLAN_NOT_FOUND();
    dailyPlan.isDeleted = true;
    return dailyPlan.save();
}

const restoreById = async (dailyPlanId: string | Schema.Types.ObjectId): Promise<IDailyPlanModel> => {
    const dailyPlan = await DailyPlan.findOne(
        QUERIES.GET_DELETED_BY_ID(dailyPlanId)
    )
    if (!dailyPlan)
        throw errors.DAILY_PLAN_NOT_FOUND();
    dailyPlan.isDeleted = false;
    return dailyPlan.save();
}

const addMeal = async (dailyPlanId: string | Schema.Types.ObjectId, addMealDTO: IAddRemoveMealDTO): Promise<IDailyPlanModel> => {
    const dailyPlan = await DailyPlan.findOne(
        QUERIES.GET_BY_ID(dailyPlanId)
    );

    if (!dailyPlan)
        throw errors.DAILY_PLAN_NOT_FOUND();

    const { meal } = addMealDTO;
    if (!meal)
        throw errors.VALIDATION_ERROR("Meal is missing in request.");

    const mealExists = await MealService.exists(meal);
    if (!mealExists)
        throw errors.MEAL_NOT_FOUND(`Meal with id: ${meal} doesn't exist`);

    const oldIndex = dailyPlan.meals.findIndex(m => m == meal);
    if (oldIndex > -1)
        throw errors.MEAL_ALREADY_EXISTS(`Meal with id: ${meal} already exists in daily plan: ${dailyPlan.name}`);

    //Add meal to list
    dailyPlan.meals.push(meal);
    return dailyPlan.save();
}

const removeMeal = async (dailyPlanId: string | Schema.Types.ObjectId, removeMealDTO: IAddRemoveMealDTO): Promise<IDailyPlanModel> => {
    const dailyPlan = await DailyPlan.findOne(
        QUERIES.GET_BY_ID(dailyPlanId)
    );

    if (!dailyPlan)
        throw errors.DAILY_PLAN_NOT_FOUND();

    const { meal } = removeMealDTO;
    if (!meal)
        throw errors.VALIDATION_ERROR("Meal is missing in request.");

    const mealExists = await MealService.exists(meal);
    if (!mealExists)
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