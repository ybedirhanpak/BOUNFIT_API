import { Router, Request, Response } from "express";
import {
    IMealCreateDTO,
    IAddIngredientDTO,
    IUpdateIngredientDTO,
    IRemoveIngredientDTO
} from "../../interfaces/meal";
import MealService from "../../services/meal";
import errors, { errorNames } from "../../helpers/errors";

const route = Router();

export default (app: Router) => {
    app.use("/meals", route);

    /**
     * Creates new meal
     */
    route.post("/create", async (req: Request, res: Response) => {
        try {
            const createDTO = req.body as IMealCreateDTO;
            const meal = await MealService.create(createDTO);
            res.status(200).send(meal);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    /**
     * Gets all meals
     */
    route.get("/getAll", async (req: Request, res: Response) => {
        try {
            const meals = await MealService.getAll();
            res.status(200).send(meals);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    /**
     * Gets all deleted meals
     */
    route.get("/getAllDeleted", async (req: Request, res: Response) => {
        try {
            const meals = await MealService.getAllDeleted();
            res.status(200).send(meals);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR())
        }
    });

    /**
     * Gets meal with given Id
     */
    route.get("/get/:Id", async (req: Request, res: Response) => {
        try {
            const meal = await MealService.getById(req.params.Id);
            res.status(200).send(meal);
        } catch (err) {
            if (err.name === errorNames.MEAL_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });


    /**
     * Deleted the meal with Id (soft delete)
     */
    route.post("/delete/:Id", async (req: Request, res: Response) => {
        try {
            const meal = await MealService.deleteById(req.params.Id);
            res.status(200).send(meal);
        } catch (err) {
            if (err.name === errorNames.MEAL_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    /**
     * Restores the meal with Id (if soft deleted previously)
     */
    route.post("/restore/:Id", async (req: Request, res: Response) => {
        try {
            const meal = await MealService.restoreById(req.params.Id);
            res.status(200).send(meal);
        } catch (err) {
            if (err.name === errorNames.MEAL_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    /**
     * Adds food into the ingredient list of the given meal
     */
    route.post("/addIngredient/:Id", async (req: Request, res: Response) => {
        try {
            const addIngredientDTO = req.body as IAddIngredientDTO;
            const meal = await MealService.addIngredient(req.params.Id, addIngredientDTO);
            res.status(200).send(meal);
        } catch (err) {
            if (err.name === errorNames.MEAL_NOT_FOUND) {
                res.status(400).send(err);
            } else if (err.name === errorNames.FOOD_NOT_FOUND) {
                res.status(400).send(err);
            } else if (err.name === errorNames.VALIDATION_ERROR) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    /**
     * Updates the quantity of food in the given meal Id and
     */
    route.post("/updateIngredient/:Id", async (req: Request, res: Response) => {
        try {
            const updateIngredientDTO = req.body as IUpdateIngredientDTO;
            const meal = await MealService.updateIngredient(req.params.Id, updateIngredientDTO);
            res.status(200).send(meal);
        } catch (err) {
            if (err.name === errorNames.MEAL_NOT_FOUND) {
                res.status(400).send(err);
            } else if (err.name === errorNames.INGREDIENT_NOT_FOUND) {
                res.status(400).send(err);
            } else if (err.name === errorNames.VALIDATION_ERROR) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    /**
     * Removes the ingredient from ingredients list
     */
    route.post("/removeIngredient/:Id", async (req: Request, res: Response) => {
        try {
            const removeIngredientDTO = req.body as IRemoveIngredientDTO;
            const meal = await MealService.removeIngredient(req.params.Id, removeIngredientDTO);
            res.status(200).send(meal);
        } catch (err) {
            if (err.name === errorNames.MEAL_NOT_FOUND) {
                res.status(400).send(err);
            } else if (err.name === errorNames.INGREDIENT_NOT_FOUND) {
                res.status(400).send(err);
            } else if (err.name === errorNames.VALIDATION_ERROR) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    })
};
