import { Router, Request, Response } from "express";
import {
    IMealModel,
    IMealCreateDTO,
    IAddIngredientDTO,
    IUpdateIngredientDTO,
    Ingredient
} from "../../interfaces/meal";
import Meal from "../../models/meal";
import { Schema, SchemaType } from "mongoose";

const route = Router();

export default (app: Router) => {
    app.use("/meals", route);

    /**
     * Creates new meal
     */
    route.post("/create", (req: Request, res: Response) => {
        //Get from request body
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
        Meal.find({ isDeleted: false })
            .populate({
                path: "ingredients.food",
                match: { isDeleted: false }
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
                    const { ingredient } = (req.body as IAddIngredientDTO);
                    const oldIndex = meal.ingredients.findIndex(i => i.food == ingredient.food);
                    //If ingredient already exists, increase its quantity
                    if (oldIndex > -1) {
                        const ingredientOld = meal.ingredients[oldIndex];
                        ingredientOld.quantity = ingredientOld.quantity.valueOf() +
                            ingredient.quantity.valueOf();
                    } else {
                        meal.ingredients.push(ingredient);
                    }

                    meal.save((err, updatedMeal) => {
                        if (err)
                            res.send(err);

                        res.send(updatedMeal);
                    })
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
                    const { ingredientId, ingredient } = req.body as IUpdateIngredientDTO;
                    const oldIndex = meal.ingredients.findIndex(i => i._id == ingredientId);
                    //If ingredient exists in indredients list, update it. O/W respond with error message
                    if (oldIndex > -1) {
                        const ingredientOld = meal.ingredients[oldIndex];
                        const { food, quantity } = ingredient;
                        if (food)
                            ingredientOld.food = food;
                        if (quantity && quantity > 0)
                            ingredientOld.quantity = quantity;

                        meal.save((err, updatedMeal) => {
                            if (err)
                                res.send(err);

                            res.send(updatedMeal);
                        })
                    } else {
                        res.status(400).send({
                            error: `In the Ingredients list of meal: ${meal.name}, there is no such ingredient with id: ${ingredientId}`
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

    /**
     * Deleted the meal with Id (soft delete)
     */
    route.post("/delete/:Id", (req: Request, res: Response) => {
        const mealId = req.params.Id;
        //Check if meal exists
        Meal.findOne(
            { $and: [{ isDeleted: { $eq: false } }, { _id: mealId }] },
            (err, meal) => {
                if (err) {
                    res.send(err);
                }
                console.log("Delete request, meal: ", meal);
                if (meal) {
                    meal.isDeleted = true;
                    meal.save((err, deletedMeal) => {
                        if (err)
                            res.send(err)

                        res.send(deletedMeal);
                    })
                } else {
                    res.status(400).send({
                        error: `No meal found with id: ${mealId}`
                    });
                }
            }
        );
    });

    /**
     * Restores the meal with Id (if soft deleted previously)
     */
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
                    meal.isDeleted = false;
                    meal.save((err, restoredMeal) => {
                        if (err)
                            res.send(err);

                        res.send(restoredMeal);
                    })
                } else {
                    res.status(400).send({
                        error: `No deleted meal found with id: ${mealId}`
                    });
                }
            }
        );
    });
};
