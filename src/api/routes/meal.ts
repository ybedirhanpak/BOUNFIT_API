import { Router } from "express";
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

    route.post("/create", async (req, res) => {
        try {
            const createDTO = req.body as IMealCreateDTO;
            const meal = await MealService.create(createDTO);
            res.status(200).send(meal);
        } catch (err) {
            if (err.name === errorNames.FOOD_NOT_FOUND ||
                err.name === errorNames.INVALID_INGREDIENT) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.get("/getAll", async (req, res) => {
        try {
            const meals = await MealService.getAll();
            res.status(200).send(meals);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    route.get("/getAllDeleted", async (req, res) => {
        try {
            const meals = await MealService.getAllDeleted();
            res.status(200).send(meals);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR())
        }
    });

    route.get("/get/:Id", async (req, res) => {
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

    route.post("/delete/:Id", async (req, res) => {
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

    route.post("/restore/:Id", async (req, res) => {
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

    route.post("/addIngredient/:Id", async (req, res) => {
        try {
            const addIngredientDTO = req.body as IAddIngredientDTO;
            const meal = await MealService.addIngredient(req.params.Id, addIngredientDTO);
            res.status(200).send(meal);
        } catch (err) {
            if (err.name === errorNames.MEAL_NOT_FOUND ||
                err.name === errorNames.FOOD_NOT_FOUND ||
                err.name === errorNames.INVALID_INGREDIENT) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.post("/updateIngredient/:Id", async (req, res) => {
        try {
            const updateIngredientDTO = req.body as IUpdateIngredientDTO;
            const meal = await MealService.updateIngredient(req.params.Id, updateIngredientDTO);
            res.status(200).send(meal);
        } catch (err) {
            if (err.name === errorNames.MEAL_NOT_FOUND ||
                err.name === errorNames.FOOD_NOT_FOUND ||
                err.name === errorNames.INVALID_INGREDIENT) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.post("/removeIngredient/:Id", async (req, res) => {
        try {
            const removeIngredientDTO = req.body as IRemoveIngredientDTO;
            const meal = await MealService.removeIngredient(req.params.Id, removeIngredientDTO);
            res.status(200).send(meal);
        } catch (err) {
            if (err.name === errorNames.MEAL_NOT_FOUND ||
                err.name === errorNames.FOOD_NOT_FOUND ||
                err.name === errorNames.INVALID_INGREDIENT) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    })
};
