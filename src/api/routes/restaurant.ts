import { Router } from "express";
import {
    IRestaurantModel,
    IRestaurantCreateDTO,
    IAddRemoveMealDTO,
    IAddRemoveFoodDTO
} from "../../interfaces/restaurant";
import errors, { errorNames } from "../../helpers/errors";
import RestaurantService from "../../services/restaurant";

const route = Router();

export default (app: Router) => {
    app.use("/restaurants", route);

    route.post("/create", async (req, res) => {
        try {
            const createDTO = req.body as IRestaurantCreateDTO;
            const restaurants = await RestaurantService.create(createDTO);
            res.status(200).send(restaurants);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    route.get("/getAll", async (req, res) => {
        try {
            const restaurants = await RestaurantService.getAll();
            res.status(200).send(restaurants);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    route.get("/getAllDeleted", async (req, res) => {
        try {
            const restaurants = await RestaurantService.getAllDeleted();
            res.status(200).send(restaurants);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    route.get("/get/:Id", async (req, res) => {
        try {
            const restaurant = await RestaurantService.getById(req.params.Id);
            res.status(200).send(restaurant);
        } catch (err) {
            if (err.name === errorNames.RESTAURANT_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.post("/addFood/:Id", async (req, res) => {
        try {
            const addFoodDTO = req.body as IAddRemoveFoodDTO;
            const restaurant = await RestaurantService.addFood(req.params.Id, addFoodDTO);
            res.status(200).send(restaurant);
        } catch (err) {
            if (err.name === errorNames.RESTAURANT_NOT_FOUND ||
                err.name === errorNames.FOOD_NOT_FOUND ||
                err.name === errorNames.FOOD_ALREADY_EXISTS ||
                err.name === errorNames.VALIDATION_ERROR) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.post("/removeFood/:Id", async (req, res) => {
        try {
            const removeFoodDTO = req.body as IAddRemoveFoodDTO;
            const restaurant = await RestaurantService.removeFood(req.params.Id, removeFoodDTO);
            res.status(200).send(restaurant);
        } catch (err) {
            if (err.name === errorNames.RESTAURANT_NOT_FOUND ||
                err.name === errorNames.FOOD_NOT_FOUND ||
                err.name === errorNames.VALIDATION_ERROR) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.post("/addMeal/:Id", async (req, res) => {
        try {
            const addMealDTO = req.body as IAddRemoveMealDTO;
            const restaurant = await RestaurantService.addMeal(req.params.Id, addMealDTO);
            res.status(200).send(restaurant);
        } catch (err) {
            if (err.name === errorNames.RESTAURANT_NOT_FOUND ||
                err.name === errorNames.MEAL_NOT_FOUND ||
                err.name === errorNames.MEAL_ALREADY_EXISTS ||
                err.name === errorNames.VALIDATION_ERROR) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.post("/removeMeal/:Id", async (req, res) => {
        try {
            const removeMealDTO = req.body as IAddRemoveMealDTO;
            const restaurant = await RestaurantService.removeMeal(req.params.Id, removeMealDTO);
            res.status(200).send(restaurant);
        } catch (err) {
            if (err.name === errorNames.RESTAURANT_NOT_FOUND ||
                err.name === errorNames.MEAL_NOT_FOUND ||
                err.name === errorNames.VALIDATION_ERROR) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

}
