import { Router } from "express";
import {
    IGroceryStoreModel,
    IGroceryStoreCreateDTO,
    IAddRemoveFoodDTO
} from "../../interfaces/groceryStore";
import GroceryStore from "../../models/groceryStore";

const route = Router();

export default (app: Router) => {
    app.use("/groceryStores", route);

    /**
     * Creates new grocery store
     */
    route.post("/create", (req, res) => {
        //Get from req body
        const groceryStoreIn: IGroceryStoreModel = {
            ...(req.body as IGroceryStoreCreateDTO),
            isDeleted: false
        }
        //Save
        new GroceryStore(groceryStoreIn).save((err, groceryStore) => {
            if (err)
                res.send(err);

            res.send(groceryStore);
        });
    });

    /**
     * Get all grocery stores
     */
    route.get("/getAll", (req, res) => {
        //Find all 
        GroceryStore.find({ isDeleted: false })
            .populate({
                path: "foods",
                match: { isDeleted: false }
            })
            .exec((err, groceryStores) => {
                if (err)
                    res.send(err);

                res.send(groceryStores);
            });
    });

    /**
     * Gets all deleted grocery stores
     */
    route.get("/getAllDeleted", (req, res) => {
        //Find all deleted
        GroceryStore.find({ isDeleted: true }, (err, groceryStores) => {
            if (err)
                res.send(err);

            res.send(groceryStores);
        });
    });

    /**
     * Get grocery store by id
     */
    route.get("/get/:Id", (req, res) => {
        const groceryStoreId = req.params.Id;
        //Find by id
        GroceryStore.find(
            { $and: [{ isDeleted: false }, { _id: groceryStoreId }] }
        ).populate({
            path: "foods",
            match: { isDeleted: false }
        }).exec((err, groceryStores) => {
            if (err)
                res.send(err);

            res.send(groceryStores);
        });
    });

    /**
     * Deletes grocery store
     */
    route.post("/delete/:Id", (req, res) => {
        const groceryStoreId = req.params.Id;
        //Find by id
        GroceryStore.findOne(
            { $and: [{ isDeleted: false }, { _id: groceryStoreId }] },
            (err, groceryStore) => {
                if (err)
                    res.send(err);

                if (groceryStore) {
                    groceryStore.isDeleted = true;
                    groceryStore.save((err, groceryStore) => {
                        if (err)
                            res.send(err);

                        res.send(groceryStore);
                    })
                } else {
                    res.status(400).send({
                        error: `No grocery store with id: ${groceryStoreId}`
                    });
                }
            }
        );
    });

    /**
     * Restores deleted grocery store
     */
    route.post("/restore/:Id", (req, res) => {
        const groceryStoreId = req.params.Id;
        //Find by id
        GroceryStore.findOne(
            { $and: [{ isDeleted: true }, { _id: groceryStoreId }] },
            (err, groceryStore) => {
                if (err)
                    res.send(err);

                if (groceryStore) {
                    groceryStore.isDeleted = false;
                    groceryStore.save((err, groceryStore) => {
                        if (err)
                            res.send(err);

                        res.send(groceryStore);
                    })
                } else {
                    res.status(400).send({
                        error: `No deleted grocery store with id: ${groceryStoreId}`
                    });
                }
            }
        );
    });

    /**
     * Adds food to grocery store
     */
    route.post("/addFood/:Id", (req, res) => {
        const groceryStoreId = req.params.Id;
        //Find by id
        GroceryStore.findOne(
            { $and: [{ isDeleted: false }, { _id: groceryStoreId }] },
            (err, groceryStore) => {
                if (err)
                    res.send(err);

                if (groceryStore) {
                    const { food } = req.body as IAddRemoveFoodDTO;
                    const oldIndex = groceryStore.foods.findIndex(f => f == food);
                    //If food doesn't exist add to list
                    if (oldIndex === -1) {
                        groceryStore.foods.push(food);
                        groceryStore.save((err, groceryStore) => {
                            if (err)
                                res.send(err);

                            res.send(groceryStore);
                        })
                    } else {
                        res.status(500).send({
                            error: `Food: ${food} already exists in list of: ${groceryStore.name}`
                        })
                    }
                } else {
                    res.status(400).send({
                        error: `No grocery store found with id: ${groceryStoreId}`
                    })
                }
            }
        )
    });

    /**
     * Removes food from grocery store
     */
    route.post("/removeFood/:Id", (req, res) => {
        const groceryStoreId = req.params.Id;
        //Find by id
        GroceryStore.findOne(
            { $and: [{ isDeleted: false }, { _id: groceryStoreId }] },
            (err, groceryStore) => {
                if (err)
                    res.send(err);

                if (groceryStore) {
                    const { food } = req.body as IAddRemoveFoodDTO;
                    const oldIndex = groceryStore.foods.findIndex(f => f == food);
                    //If food exists in the list, remove it
                    if (oldIndex > -1) {
                        groceryStore.foods.splice(oldIndex, 1);
                        groceryStore.save((err, groceryStore) => {
                            if (err)
                                res.send(err);

                            res.send(groceryStore);
                        })
                    } else {
                        res.status(500).send({
                            error: `Food: ${food} doesn't exist in list of: ${groceryStore.name}`
                        })
                    }
                } else {
                    res.status(400).send({
                        error: `No grocery store found with id: ${groceryStoreId}`
                    })
                }
            }
        )
    });
}