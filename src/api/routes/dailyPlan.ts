import { Router, Request, Response } from "express";
import {
    IDailyPlanModel,
    IDailyPlanCreateModel
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
            ...(req.body as IDailyPlanCreateModel),
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
        DailyPlan.find({ isDeleted: { $eq: false } }, (err, dailyPlan) => {
            if (err) {
                res.send(err);
            }
            res.status(200).json(dailyPlan);
        });
    });

    /**
     * Gets daily plan with given id
     */
    route.get("/get/:Id", (req, res) => {
        const dailyPlanId = req.params.Id;
        //Find by id
        DailyPlan.findOne({
            $and: [{ isDeleted: { $eq: false } }, { _id: dailyPlanId }]
        })
        .populate({
            path: "meals",
            match: { isDeleted: { $eq: false } }
        })
        .exec((err, dailyPlans) => {
            if (err) {
                res.send(err);
            }
            res.json(dailyPlans);
        });
    });
};
