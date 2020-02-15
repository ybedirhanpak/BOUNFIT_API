import { Router } from "express";
import {
    IFoodCreateDTO,
    IFoodUpdateDTO
} from "../../interfaces/food";
import FoodService from "../../services/food";
import errors, { errorNames } from "../../helpers/errors";

const route = Router();

export default (app: Router) => {
    app.use("/foods", route);

    route.post("/create", async (req, res) => {
        try {
            const createDTO = req.body as IFoodCreateDTO;
            const foods = await FoodService.create(createDTO);
            res.status(200).send(foods);
        } catch (err) {
            if (err.name === errorNames.INVALID_FOOD) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.get("/getAll", async (req, res) => {
        try {
            const foods = await FoodService.getAll();
            res.status(200).send(foods);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    route.get("/getAllDeleted", async (req, res) => {
        try {
            const foods = await FoodService.getAllDeleted();
            res.status(200).send(foods);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR())
        }
    });

    route.get("/get/:Id", async (req, res) => {
        try {
            const food = await FoodService.getById(req.params.Id);
            res.status(200).send(food);
        } catch (err) {
            if (err.name === errorNames.FOOD_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.post("/update/:Id", async (req, res) => {
        try {
            const food = await FoodService.updateById(req.params.Id, req.body as IFoodUpdateDTO);
            res.status(200).send(food);
        } catch (err) {
            if (err.name === errorNames.FOOD_NOT_FOUND ||
                err.name === errorNames.INVALID_FOOD) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.post("/delete/:Id", async (req, res) => {
        try {
            const food = await FoodService.deleteById(req.params.Id);
            res.status(200).send(food);
        } catch (err) {
            if (err.name === errorNames.FOOD_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.post("/restore/:Id", async (req, res) => {
        try {
            const food = await FoodService.restoreById(req.params.Id);
            res.status(200).send(food);
        } catch (err) {
            if (err.name === errorNames.FOOD_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });
}
