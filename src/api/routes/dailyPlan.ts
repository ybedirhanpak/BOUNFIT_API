import { Router, Request, Response } from "express";
import {
    IDailyPlanModel,
    IDailyPlanCreateDTO,
    IAddRemoveMealDTO
} from "../../interfaces/dailyPlan";
import DailyPlan from "../../models/dailyPlan";

const route = Router();

export default (app: Router) => {
    app.use("/dailyPlans", route);

    /**
     * Creates new daily plan
     */
    route.post("/create", (req, res) => {
        //Create object with dto
        const dailyPlanIn: IDailyPlanModel = {
            ...(req.body as IDailyPlanCreateDTO),
            isDeleted: false
        };
        //Save
        new DailyPlan(dailyPlanIn).save((err, dailyPlan) => {
            if (err) {
                res.send(err);
            }
            res.json(dailyPlan);
        });
    });

    /**
     * Gets all daily plans
     */
    route.get("/getAll", (req, res) => {
        //Find all
        DailyPlan.find({ isDeleted: false })
            .populate({
                path: "meals",
                match: { isDeleted: false },
                populate: {
                    path: "ingredients.food",
                    match: { isDeleted: false }
                }
            })
            .exec((err, dailyPlans) => {
                if (err)
                    res.send(err);

                res.send(dailyPlans);
            })
    });

    /**
     * Gets all deleted daily plans
     */
    route.get("/getAllDeleted", (req, res) => {
        //Find all deleted
        DailyPlan.find({ isDeleted: true }, (err, dailyPlans) => {
            if (err)
                res.send(err);

            res.send(dailyPlans);
        })
    })

    /**
     * Gets daily plan with given id
     */
    route.get("/get/:Id", (req, res) => {
        const dailyPlanId = req.params.Id;
        //Find by id
        DailyPlan.findOne({
            $and: [{ isDeleted: false }, { _id: dailyPlanId }]
        })
            .populate({
                path: "meals",
                match: { isDeleted: false },
                populate: {
                    path: "ingredients.food",
                    match: { isDeleted: false }
                }
            })
            .exec((err, dailyPlans) => {
                if (err) {
                    res.send(err);
                }
                res.json(dailyPlans);
            });
    });

    /**
     * Deletes daily plan with id
     */
    route.post("/delete/:Id", (req, res) => {
        const dailyPlanId = req.params.Id;
        //Check if daily plan exists
        DailyPlan.findOne(
            { $and: [{ isDeleted: false }, { _id: dailyPlanId }] },
            (err, dailyPlan) => {
                if (err)
                    res.send(err);

                if (dailyPlan) {
                    dailyPlan.isDeleted = true;
                    dailyPlan.save((err, deletedDailyPlan) => {
                        if (err)
                            res.send(err);

                        res.send(deletedDailyPlan);
                    })
                } else {
                    res.status(400).send({
                        error: `No daily plan found with id: ${dailyPlanId}`
                    })
                }
            }
        );
    })

    /**
     * Restores daily plan with id
     */
    route.post("/restore/:Id", (req, res) => {
        const dailyPlanId = req.params.Id;
        //Check if daily plan exists
        DailyPlan.findOne(
            { $and: [{ isDeleted: true }, { _id: dailyPlanId }] },
            (err, dailyPlan) => {
                if (err)
                    res.send(err);

                if (dailyPlan) {
                    dailyPlan.isDeleted = false;
                    dailyPlan.save((err, restoredDailyPlan) => {
                        if (err)
                            res.send(err);

                        res.send(restoredDailyPlan);
                    })
                } else {
                    res.status(400).send({
                        error: `No deleted daily plan found with id: ${dailyPlanId}`
                    })
                }
            }
        );
    })

    /**
     * Adds meal to daily plan with given Id
     */
    route.post("/addMeal/:Id", (req, res) => {
        const dailyPlanId = req.params.Id;
        DailyPlan.findOne(
            { $and: [{ isDeleted: false }, { _id: dailyPlanId }] },
            (err, dailyPlan) => {
                if (err)
                    res.send(err);

                if (dailyPlan) {
                    const { meal } = req.body as IAddRemoveMealDTO;
                    const oldIndex = dailyPlan.meals.findIndex(x => x == meal);
                    if (oldIndex === -1) {
                        dailyPlan.meals.push(meal);
                        dailyPlan.save((err, updatedDailyPlan) => {
                            if (err)
                                res.send(err);

                            res.send(updatedDailyPlan);
                        });
                    } else {
                        res.status(500).send({
                            error: `Meal with id: ${meal} already exists in meals list of daily plan: ${dailyPlan.name}`
                        })
                    }
                } else {
                    res.status(400).send({
                        error: `No daily plan found with id: ${dailyPlanId}`
                    })
                }
            }
        )
    })

    /**
     * Adds meal to daily plan with given Id
     */
    route.post("/removeMeal/:Id", (req, res) => {
        const dailyPlanId = req.params.Id;
        DailyPlan.findOne(
            { $and: [{ isDeleted: false }, { _id: dailyPlanId }] },
            (err, dailyPlan) => {
                if (err)
                    res.send(err);

                if (dailyPlan) {
                    const { meal } = req.body as IAddRemoveMealDTO;
                    const oldIndex = dailyPlan.meals.findIndex(x => x == meal);
                    if (oldIndex > -1) {
                        dailyPlan.meals.splice(oldIndex, 1);
                        dailyPlan.save((err, updatedDailyPlan) => {
                            if (err)
                                res.send(err);

                            res.send(updatedDailyPlan);
                        });
                    } else {
                        res.status(500).send({
                            error: `Meal with id: ${meal} doesn't exist in meals list of daily plan: ${dailyPlan.name}`
                        })
                    }
                } else {
                    res.status(400).send({
                        error: `No daily plan found with id: ${dailyPlanId}`
                    })
                }
            }
        )
    })
};
