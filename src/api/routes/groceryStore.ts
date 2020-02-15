import { Router } from "express";
import {
    IGroceryStoreModel,
    IGroceryStoreCreateDTO,
    IAddRemoveFoodDTO
} from "../../interfaces/groceryStore";
import errors, { errorNames } from "../../helpers/errors";
import GroceryStoreService from "../../services/groceryStore";

const route = Router();

export default (app: Router) => {
    app.use("/groceryStores", route);

    route.post("/create", async (req, res) => {
        try {
            const createDTO = req.body as IGroceryStoreCreateDTO;
            const groceryStores = await GroceryStoreService.create(createDTO);
            res.status(200).send(groceryStores);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    route.get("/getAll", async (req, res) => {
        try {
            const groceryStores = await GroceryStoreService.getAll();
            res.status(200).send(groceryStores);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });

    route.get("/getAllDeleted", async (req, res) => {
        try {
            const groceryStores = await GroceryStoreService.getAllDeleted();
            res.status(200).send(groceryStores);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR())
        }
    })

    route.get("/get/:Id", async (req, res) => {
        try {
            const groceryStore = await GroceryStoreService.getById(req.params.Id);
            res.status(200).send(groceryStore);
        } catch (err) {
            if (err.name === errorNames.GROCERY_STORE_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    });

    route.post("/delete/:Id", async (req, res) => {
        try {
            const groceryStore = await GroceryStoreService.deleteById(req.params.Id);
            res.status(200).send(groceryStore);
        } catch (err) {
            if (err.name === errorNames.GROCERY_STORE_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    })

    route.post("/restore/:Id", async (req, res) => {
        try {
            const groceryStore = await GroceryStoreService.restoreById(req.params.Id);
            res.status(200).send(groceryStore);
        } catch (err) {
            if (err.name === errorNames.GROCERY_STORE_NOT_FOUND) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    })

    route.post("/addFood/:Id", async (req, res) => {
        try {
            const addFoodDTO = req.body as IAddRemoveFoodDTO;
            const groceryStore = await GroceryStoreService.addFood(req.params.Id, addFoodDTO);
            res.status(200).send(groceryStore);
        } catch (err) {
            if (err.name === errorNames.GROCERY_STORE_NOT_FOUND ||
                err.name === errorNames.FOOD_NOT_FOUND ||
                err.name === errorNames.FOOD_ALREADY_EXISTS ||
                err.name === errorNames.VALIDATION_ERROR) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    })

    route.post("/removeFood/:Id", async (req, res) => {
        try {
            const removeFoodDTO = req.body as IAddRemoveFoodDTO;
            const groceryStore = await GroceryStoreService.removeFood(req.params.Id, removeFoodDTO);
            res.status(200).send(groceryStore);
        } catch (err) {
            if (err.name === errorNames.GROCERY_STORE_NOT_FOUND ||
                err.name === errorNames.FOOD_NOT_FOUND ||
                err.name === errorNames.VALIDATION_ERROR) {
                res.status(400).send(err);
            } else {
                res.status(500).send(errors.INTERNAL_ERROR(err));
            }
        }
    })
};
