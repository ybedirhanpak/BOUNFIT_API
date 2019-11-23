import { Router, Request, Response } from "express";
import {
    IFoodModel,
    IFoodCreateDTO,
    IFoodUpdateDTO
} from "../../interfaces/food";
import Food from "../../models/food";

const route = Router();

export default (app: Router) => {
    app.use("/foods", route);

    /**
     * Creates new food
     */
    route.post("/create", (req: Request, res: Response) => {
        //Create object with dto
        const foodIn: IFoodModel = {
            ...(req.body as IFoodCreateDTO),
            isDeleted: false
        };
        //Save
        new Food(foodIn).save((err, food) => {
            if (err) {
                res.send(err);
            }
            res.json(food);
        });
    });

    /**
     * Gets all foods
     */
    route.get("/getAll", (req: Request, res: Response) => {
        //Find all
        Food.find({ isDeleted: { $eq: false } }, (err, foods) => {
            if (err) {
                res.send(err);
            }
            res.json(foods);
        });
    });

    /**
     * Gets all deleted foods
     */
    route.get("/getAllDeleted", (req: Request, res: Response) => {
        //Find all
        Food.find({ isDeleted: { $eq: true } }, (err, foods) => {
            if (err) {
                res.send(err);
            }
            res.json(foods);
        });
    });

    /**
     * Gets food with given Id
     */
    route.get("/get/:Id", (req: Request, res: Response) => {
        const foodId = req.params.Id;
        //Find by Id
        Food.findOne(
            { $and: [{ isDeleted: { $eq: false } }, { _id: foodId }] },
            (err, food) => {
                if (err) {
                    res.send(err);
                }
                res.json(food);
            }
        );
    });

    /**
     * Updates the food with given id and food update dto
     */
    route.post("/update/:Id", (req: Request, res: Response) => {
        const foodId = req.params.Id;
        //Find by Id
        Food.findOne(
            { $and: [{ isDeleted: { $eq: false } }, { _id: foodId }] },
            (err, food) => {
                if (err) {
                    res.send(err);
                }
                if (food) {
                    //Combine old food and foodIn
                    const updatedFood = {
                        ...JSON.parse(JSON.stringify(food)),
                        ...(req.body as IFoodUpdateDTO)
                    };
                    console.log("updatedFood", updatedFood);
                    Food.findOneAndUpdate(
                        { _id: foodId },
                        updatedFood,
                        (err, food) => {
                            if (err) {
                                res.send(err);
                            }
                            //Return updated food
                            res.json(updatedFood);
                        }
                    );
                } else {
                    res.status(400).send({
                        error: `No food found with id: `,
                        foodId
                    });
                }
            }
        );
    });

    /**
     * Deletes the food with given Id (soft delete)
     */
    route.post("/delete/:Id", (req: Request, res: Response) => {
        const foodId = req.params.Id;
        //Find by Id
        Food.findOne(
            { $and: [{ isDeleted: { $eq: false } }, { _id: foodId}] },
            (err, food) => {
                if (err) {
                    res.send(err);
                }
                if (food) {
                    Food.findOneAndUpdate(
                        { _id: foodId },
                        { $set: { isDeleted: true } },
                        (err, food) => {
                            if (err) {
                                res.status(400).send(err);
                            }
                            //Return updated food
                            res.json({
                                ...JSON.parse(JSON.stringify(food)),
                                isDeleted: true
                            });
                        }
                    )
                } else {
                    res.status(400).send({
                        error: `No food with id: ${foodId}`
                    });
                }
            }
        );
    });

    /**
     * Restores the food with given Id (previously soft deleted)
     */
    route.post("/restore/:Id", (req: Request, res: Response) => {
        const foodId = req.params.Id;
        //Find by Id
        Food.findOne(
            { $and: [{ isDeleted: { $eq: true } }, { _id: req.params.Id }] },
            (err, food) => {
                if (err) {
                    res.send(err);
                }
                if (food) {
                    Food.findOneAndUpdate(
                        { _id: foodId },
                        { $set: { isDeleted: false } },
                        (err, food) => {
                            if (err) {
                                res.send(err);
                            }
                            //Return updated food
                            res.json({
                                ...JSON.parse(JSON.stringify(food)),
                                isDeleted: false
                            });
                        }
                    );
                } else {
                    res.status(400).send({
                        error: `No food with id: ${foodId}`
                    });
                }
            }
        );
    });
};
