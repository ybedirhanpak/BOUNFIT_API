import { Router, Request, Response } from "express";
import {
    IMealModel,
    IMealCreateDTO,
    IAddIngredientsDTO,
    IUpdateIngredientDTO
} from "../../interfaces/meal";
import Meal from "../../models/meal";

const route = Router();

export default (app: Router) => {
    app.use("/meals", route);

    /**
     * Creates new meal
     */
    route.post("/create", (req: Request, res: Response) => {
        //Get from request
        const mealIn: IMealModel = {
            ...(req.body as IMealCreateDTO),
            isDeleted: false
        };
        //Save
        new Meal(mealIn).save((err, meal) => {
            if (err) {
                res.send(err);
            }
            res.json(meal);
        });
    });

    /**
     * Gets all meals
     */
    route.get("/getAll", (req: Request, res: Response) => {
        //Find all
        Meal.find({ isDeleted: { $eq: false } })
            .populate({
                path: "ingredients.food",
                match: { isDeleted: { $eq: false } }
            })
            .exec((err, meals) => {
                if (err) {
                    res.send(err);
                }
                res.json(meals);
            });
    });

    /**
     * Gets all deleted meals
     */
    route.get("/getAllDeleted", (req: Request, res: Response) => {
        //Find all deleted meals
        Meal.find({ isDeleted: { $eq: true } })
            .populate("ingredients.food")
            .exec((err, meals) => {
                if (err) {
                    res.send(err);
                }
                res.json(meals);
            });
    });

    /**
     * Gets meal with given Id
     */
    route.get("/get/:Id", (req: Request, res: Response) => {
        const mealId = req.params.Id;
        //Find all
        Meal.findOne({ $and: [{ isDeleted: { $eq: false } }, { _id: mealId }] })
            .populate({
                path: "ingredients.food",
                match: { isDeleted: { $eq: false } }
            })
            .exec((err, meals) => {
                if (err) {
                    res.send(err);
                }
                res.json(meals);
            });
    });

    /**
     * Adds food into the ingredient list of the given meal
     */
    route.post("/addIngredient/:Id", (req: Request, res: Response) => {
        const mealId = req.params.Id;
        //Find by Id
        Meal.findOne(
            { $and: [{ isDeleted: { $eq: false } }, { _id: mealId }] },
            (err, meal) => {
                if (err) {
                    res.send(err);
                }
                if (meal) {
                    //Ingredients array of the meal
                    const ingredients = (JSON.parse(
                        JSON.stringify(meal)
                    ) as IMealModel).ingredients;
                    const ingredientIn = (req.body as IAddIngredientsDTO)
                        .ingredient;
                    //If the food already exists in the ingredints list, increase its quantity instead of adding a new object.
                    const ingredientOld = ingredients.find(
                        i => i.food === ingredientIn.food
                    );
                    if (ingredientOld) {
                        Meal.updateOne(
                            { _id: mealId },
                            {
                                $inc: {
                                    "ingredients.$[element].quantity":
                                        ingredientIn.quantity
                                }
                            },
                            {
                                arrayFilters: [
                                    { "element.food": ingredientOld.food }
                                ]
                            }
                        ).exec((err: any, meal: any) => {
                            if (err) {
                                res.send(err);
                            }
                            res.json(meal);
                        });
                    } else {
                        Meal.findOneAndUpdate(
                            { _id: mealId },
                            { $push: { ingredients: ingredientIn } },
                            (err, meal) => {
                                if (err) {
                                    res.send(err);
                                }
                                res.json(meal);
                            }
                        );
                    }
                } else {
                    res.status(400).send({
                        error: `No meal found with id:${mealId}`
                    });
                }
            }
        );
    });

    /**
     * Updates the quantity of food in the given meal Id and
     */
    route.post("/updateIngredient/:Id", (req: Request, res: Response) => {
        const mealId = req.params.Id;
        //Find by Id
        Meal.findOne(
            { $and: [{ isDeleted: { $eq: false } }, { _id: mealId }] },
            (err, meal) => {
                if (err) {
                    res.send(err);
                }
                if (meal) {
                    //Ingredients array of the meal
                    const ingredients = (JSON.parse(
                        JSON.stringify(meal)
                    ) as IMealModel).ingredients;
                    const ingredientIn = (req.body as IUpdateIngredientDTO)
                        .ingredient;
                    //Ensure that quantity cannot be less than 0
                    if (ingredientIn.quantity && ingredientIn.quantity < 0) {
                        ingredientIn.quantity = 0;
                    }
                    const ingredientInId = (req.body as IUpdateIngredientDTO)
                        .ingredientId;
                    //Find if the food already exists in the ingredints list. If so, increase its quantity.
                    const ingredientOld = ingredients.find(
                        i => i._id === ingredientInId
                    );
                    if (ingredientOld) {
                        const ingredientUpdated = {
                            ...ingredientOld,
                            ...ingredientIn
                        };
                        Meal.update(
                            { _id: req.params.Id },
                            {
                                $set: {
                                    "ingredients.$[element]": ingredientUpdated
                                }
                            },
                            {
                                arrayFilters: [
                                    { "element._id": ingredientOld._id }
                                ]
                            }
                        ).exec((err: any, meal: any) => {
                            if (err) {
                                res.send(err);
                            }
                            res.json(meal);
                        });
                    } else {
                        res.status(400).send({
                            error: "Food not found in ingredient list."
                        });
                    }
                } else {
                    res.status(400).send({
                        error: `No meal found with id: ${mealId}`
                    });
                }
            }
        );
    });

    route.post("/delete/:Id", (req: Request, res: Response) => {
        const mealId = req.params.Id;
        //Check if meal exists
        Meal.findOne(
            { $and: [{ isDeleted: { $eq: false } }, { _id: mealId }] },
            (err, meal) => {
                if (err) {
                    res.send(err);
                }
                if (meal) {
                    Meal.findByIdAndUpdate(
                        mealId,
                        { $set: { isDeleted: true } },
                        (err, meal) => {
                            if (err) {
                                res.send(err);
                            }
                            //Send respond with updated meal
                            res.status(200).send({
                                ...JSON.parse(JSON.stringify(meal)),
                                isDeleted: true
                            });
                        }
                    );
                } else {
                    res.status(400).send({
                        error: `No meal found with id: ${mealId}`
                    });
                }
            }
        );
    });

    route.post("/restore/:Id", (req: Request, res: Response) => {
        const mealId = req.params.Id;
        //Check if meal exists
        Meal.findOne(
            { $and: [{ isDeleted: { $eq: true } }, { _id: mealId }] },
            (err, meal) => {
                if (err) {
                    res.send(err);
                }
                if (meal) {
                    Meal.findByIdAndUpdate(
                        mealId,
                        { $set: { isDeleted: false } },
                        (err, meal) => {
                            if (err) {
                                res.status(400).send(err);
                            }
                            //Send respond with updated meal
                            res.status(200).send({
                                ...JSON.parse(JSON.stringify(meal)),
                                isDeleted: false
                            });
                        }
                    );
                } else {
                    res.status(400).send({
                        error: `No meal found with id: ${mealId}`
                    });
                }
            }
        );
    });
};
