import { Router } from "express";
import {
    ISchoolFood,
    ISchoolMeal
} from "../../interfaces/school";
import SchoolService from "../../services/school";
import errors, { errorNames } from "../../helpers/errors";

const route = Router();

export default (app: Router) => {
    app.use("/school", route);

    route.get("/getCurrentMeals", async (req, res) => {
        try {
            const foods = await SchoolService.getCurrentSchoolMeals();
            res.status(200).send(foods);
        } catch (err) {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    });
}
