import { Router } from 'express';
import {
  MealCreateDTO,
  AddRemoveFoodDTO,
} from '../../interfaces/meal';
import MealService from '../../services/meal';
import errors, { errorNames } from '../../helpers/errors';

const route = Router();

export default (app: Router) => {
  app.use('/meals', route);

  route.post('/create', async (req, res) => {
    try {
      const createDTO = req.body as MealCreateDTO;
      const meal = await MealService.Create(createDTO);
      res.status(200).send(meal);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.get('/getAll', async (req, res) => {
    try {
      const meals = await MealService.GetAll();
      res.status(200).send(meals);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR(err));
    }
  });

  route.get('/getAllDeleted', async (req, res) => {
    try {
      const meals = await MealService.GetAllDeleted();
      res.status(200).send(meals);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR());
    }
  });

  route.get('/get/:Id', async (req, res) => {
    try {
      const meal = await MealService.GetById(req.params.Id);
      res.status(200).send(meal);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.get('/getWithFoods/:Id', async (req, res) => {
    try {
      const meal = await MealService.GetWithFoods(req.params.Id);
      res.status(200).send(meal);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/delete/:Id', async (req, res) => {
    try {
      const meal = await MealService.DeleteById(req.params.Id);
      res.status(200).send(meal);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/restore/:Id', async (req, res) => {
    try {
      const meal = await MealService.RestoreById(req.params.Id);
      res.status(200).send(meal);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/addFood/:Id', async (req, res) => {
    try {
      const meal = await MealService.AddFood(req.params.Id, req.body as AddRemoveFoodDTO);
      res.status(200).send(meal);
    } catch (err) {
      if (err.name === errorNames.MEAL_NOT_FOUND
          || err.name === errorNames.INSTANCE_NOT_FOUND
      ) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/removeFood/:Id', async (req, res) => {
    try {
      const meal = await MealService.RemoveFood(req.params.Id, req.body as AddRemoveFoodDTO);
      res.status(200).send(meal);
    } catch (err) {
      if (err.name === errorNames.MEAL_NOT_FOUND
          || err.name === errorNames.INSTANCE_NOT_FOUND
      ) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });
};
