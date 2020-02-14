import { Router } from "express";
import {
    IRestaurantModel,
    ICreateResturantDTO,
    IAddRemoveMealDTO,
    IAddRemoveFoodDTO
} from "../../interfaces/restaurant";

import Restaurant from "../../models/restaurant";

import { isFoodValid } from "../../services/food";
import { isMealValid } from "../../services/meal";

const route = Router();

export default (app: Router) => {
    app.use("/restaurants", route);

    /**
     * Creates new restaurant
     */
    route.post("/create", (req, res) => {
        const restaurantIn: IRestaurantModel = {
            ...req.body as ICreateResturantDTO,
            isDeleted: false
        }
        new Restaurant(restaurantIn).save((err, restaurant) => {
            if (err)
                res.send(err);

            res.send(restaurant);
        });
    });

    /**
     * Gets all restaurants
     */
    route.get("/getAll", (req, res) => {
        //Find all
        Restaurant.find(
            { isDeleted: false },
            (err, restaurants) => {
                if (err)
                    res.send(err);

                res.send(restaurants);
            }
        );
    });

    /**
     * Gets all deleted restaurants
     */
    route.get("/getAllDeleted", (req, res) => {
        //Find all deleted
        Restaurant.find(
            { isDeleted: true },
            (err, restaurants) => {
                if (err)
                    res.send(err);

                res.send(restaurants);
            }
        );
    });

    /**
     * Gets restaurant by its id
     */
    route.get("/get/:Id", (req, res) => {
        const restaurantId = req.params.Id;
        Restaurant.findOne(
            { $and: [{ isDeleted: false }, { _id: restaurantId }] }
        ).populate({
            path: "foods",
            match: { isDeleted: false }
        }).populate({
            path: "meals",
            match: { isDeleted: false }
        }).exec((err, restaurant) => {
            if (err)
                res.send(err);

            res.send(restaurant);
        })
    });

    /**
     * Adds food to restaurant
     */
    route.post("/addFood/:Id", (req, res) => {
        const restaurantId = req.params.Id;
        Restaurant.findOne(
            { $and: [{ isDeleted: false }, { _id: restaurantId }] },
            (err, restaurant) => {
                if (err)
                    res.send(err);
                if (restaurant) {
                    const { food } = req.body as IAddRemoveFoodDTO;
                    const oldIndex = restaurant.foods.findIndex(f => f == food);
                    //If food doesn't exist in list add it
                    if (oldIndex === -1) {
                        if (!isFoodValid(food)) {
                            res.status(500).send({
                                error: `Food: ${food} is not valid.`
                            })
                        }
                        restaurant.foods.push(food);
                        restaurant.save((err, restaurant) => {
                            if (err)
                                res.send(err);

                            res.send(restaurant);
                        });
                    } else {
                        res.status(500).send({
                            error: `Food: ${food} already exists in restaurant: ${restaurant.name}`
                        });
                    }
                } else {
                    res.status(400).send({
                        error: `No restaurant found with id: ${restaurantId}`
                    })
                }
            }
        );
    });

    /**
     * Removes food from restaurant
     */
    route.post("/removeFood/:Id", (req, res) => {
        const restaurantId = req.params.Id;
        Restaurant.findOne(
            { $and: [{ isDeleted: false }, { _id: restaurantId }] },
            (err, restaurant) => {
                if (err)
                    res.send(err);

                if (restaurant) {
                    const { food } = req.body as IAddRemoveFoodDTO;
                    const oldIndex = restaurant.foods.findIndex(f => f == food);
                    //If food already exists in the list, remove it
                    if (oldIndex > -1) {
                        restaurant.foods.splice(oldIndex, 1);
                        restaurant.save((err, restaurant) => {
                            if (err)
                                res.send(err);

                            res.send(restaurant);
                        })
                    } else {
                        res.status(500).send({
                            error: `Food: ${food} doesn't exists in restaurant: ${restaurant.name}`
                        })
                    }
                } else {
                    res.status(400).send({
                        error: `No restaurant found with id: ${restaurantId}`
                    })
                }
            }
        );
    });

    /**
     * Adds meal to restaurant
     */
    route.post("/addMeal/:Id", (req, res) => {
        const restaurantId = req.params.Id;
        Restaurant.findOne(
            { $and: [{ isDeleted: false }, { _id: restaurantId }] },
            (err, restaurant) => {
                if (err)
                    res.send(err);
                if (restaurant) {
                    const { meal } = req.body as IAddRemoveMealDTO;
                    const oldIndex = restaurant.foods.findIndex(m => m == meal);
                    //If meal doesn't exist in list add it
                    if (oldIndex === -1) {
                        if (!isMealValid(meal)) {
                            res.status(500).send({
                                error: `Meal: ${meal} is not valid.`
                            })
                        }
                        restaurant.meals.push(meal);
                        restaurant.save((err, restaurant) => {
                            if (err)
                                res.send(err);

                            res.send(restaurant);
                        });
                    } else {
                        res.status(500).send({
                            error: `Meal: ${meal} already exists in restaurant: ${restaurant.name}`
                        });
                    }
                } else {
                    res.status(400).send({
                        error: `No restaurant found with id: ${restaurantId}`
                    })
                }
            }
        );
    });

    /**
     * Removes food from restaurant
     */
    route.post("/removeMeal/:Id", (req, res) => {
        const restaurantId = req.params.Id;
        Restaurant.findOne(
            { $and: [{ isDeleted: false }, { _id: restaurantId }] },
            (err, restaurant) => {
                if (err)
                    res.send(err);

                if (restaurant) {
                    const { meal } = req.body as IAddRemoveMealDTO;
                    const oldIndex = restaurant.meals.findIndex(f => f == meal);
                    //If meal already exists in the list, remove it
                    if (oldIndex > -1) {
                        restaurant.meals.splice(oldIndex, 1);
                        restaurant.save((err, restaurant) => {
                            if (err)
                                res.send(err);

                            res.send(restaurant);
                        });
                    } else {
                        res.status(500).send({
                            error: `Meal: ${meal} doesn't exists in restaurant: ${restaurant.name}`
                        });
                    }
                } else {
                    res.status(400).send({
                        error: `No restaurant found with id: ${restaurantId}`
                    });
                }
            }
        );
    });

}
