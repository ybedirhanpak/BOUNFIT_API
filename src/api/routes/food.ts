import { Router, Request, Response } from "express";
import {
    IFoodCreateDTO,
    IFoodUpdateDTO
} from "../../interfaces/food";
import FoodService from "../../services/food";
import errors, { errorNames } from "../../helpers/errors";

const route = Router();

export default (app: Router) => {
    app.use("/foods", route);

    /**
     * Creates new food
     */
    route.post("/create", async (req: Request, res: Response) => {
        try {
            const createDTO = req.body as IFoodCreateDTO;
            const foods = await FoodService.create(createDTO);
            res.status(200).send(foods);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    /**
     * Gets all foods
     */
    route.get("/getAll", async (req: Request, res: Response) => {
        try {
            const foods = await FoodService.getAll();
            res.status(200).send(foods);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    /**
     * Gets all deleted foods
     */
    route.get("/getAllDeleted", async (req: Request, res: Response) => {
        try {
            const foods = await FoodService.getAllDeleted();
            res.status(200).send(foods);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR())
        }
    });

    /**
     * Gets food with given Id
     */
    route.get("/get/:Id", async (req: Request, res: Response) => {
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

    /**
     * Updates the food with given id and food update dto
     */
    route.post("/update/:Id", async (req: Request, res: Response) => {
        try {
            const food = await FoodService.updateById(req.params.Id, req.body as IFoodUpdateDTO);
            res.status(200).send(food);
        } catch (err) {
            if (err.name === errorNames.FOOD_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    /**
     * Deletes the food with given Id (soft delete)
     */
    route.post("/delete/:Id", async (req: Request, res: Response) => {
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

    /**
     * Restores the food with given Id (previously soft deleted)
     */
    route.post("/restore/:Id", async (req: Request, res: Response) => {
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
