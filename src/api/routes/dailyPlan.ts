import { Router, Request, Response } from "express";
import {
    IDailyPlanModel,
    IDailyPlanCreateDTO,
    IAddRemoveMealDTO
} from "../../interfaces/dailyPlan";
import DailyPlan from "../../models/dailyPlan";
import errors, { errorNames } from "../../helpers/errors";
import DailyPlanService from "../../services/dailyPlan";

const route = Router();

export default (app: Router) => {
    app.use("/dailyPlans", route);

    route.post("/create", async (req, res) => {
        try {
            const createDTO = req.body as IDailyPlanCreateDTO;
            const dailyPlans = await DailyPlanService.create(createDTO);
            res.status(200).send(dailyPlans);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    route.get("/getAll", async (req, res) => {
        try {
            const dailyPlans = await DailyPlanService.getAll();
            res.status(200).send(dailyPlans);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    route.get("/getAllDeleted", async (req, res) => {
        try {
            const dailyPlans = await DailyPlanService.getAllDeleted();
            res.status(200).send(dailyPlans);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR())
        }
    })

    route.get("/get/:Id", async (req, res) => {
        try {
            const dailyPlan = await DailyPlanService.getById(req.params.Id);
            res.status(200).send(dailyPlan);
        } catch (err) {
            if (err.name === errorNames.DAILY_PLAN_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.post("/delete/:Id", async (req, res) => {
        try {
            const dailyPlan = await DailyPlanService.deleteById(req.params.Id);
            res.status(200).send(dailyPlan);
        } catch (err) {
            if (err.name === errorNames.DAILY_PLAN_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    })

    route.post("/restore/:Id", async (req, res) => {
        try {
            const dailyPlan = await DailyPlanService.restoreById(req.params.Id);
            res.status(200).send(dailyPlan);
        } catch (err) {
            if (err.name === errorNames.DAILY_PLAN_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    })

    route.post("/addMeal/:Id", async (req, res) => {
        try {
            const addMealDTO = req.body as IAddRemoveMealDTO;
            const dailyPlan = await DailyPlanService.addMeal(req.params.Id, addMealDTO);
            res.status(200).send(dailyPlan);
        } catch (err) {
            if (err.name === errorNames.DAILY_PLAN_NOT_FOUND ||
                err.name === errorNames.MEAL_NOT_FOUND ||
                err.name === errorNames.MEAL_ALREADY_EXISTS ||
                err.name === errorNames.VALIDATION_ERROR) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    })

    route.post("/removeMeal/:Id", async (req, res) => {
        try {
            const removeMealDTO = req.body as IAddRemoveMealDTO;
            const dailyPlan = await DailyPlanService.addMeal(req.params.Id, removeMealDTO);
            res.status(200).send(dailyPlan);
        } catch (err) {
            if (err.name === errorNames.DAILY_PLAN_NOT_FOUND ||
                err.name === errorNames.MEAL_NOT_FOUND ||
                err.name === errorNames.VALIDATION_ERROR) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    })
};
