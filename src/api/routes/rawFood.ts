import { Router } from 'express';
import {
  RawFoodCreateDTO,
  RawFoodUpdateDTO,
} from '../../interfaces/rawFood';
import FoodService from '../../services/rawFood';
import errors, { errorNames } from '../../helpers/errors';

const route = Router();

export default (app: Router) => {
  app.use('/rawFoods', route);

  route.post('/create', async (req, res) => {
    try {
      const createDTO = req.body as RawFoodCreateDTO;
      const rawFoods = await FoodService.Create(createDTO);
      res.status(200).send(rawFoods);
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
      const rawFoods = await FoodService.GetAll();
      res.status(200).send(rawFoods);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR(err));
    }
  });

  route.get('/getAllDeleted', async (req, res) => {
    try {
      const rawFoods = await FoodService.GetAllDeleted();
      res.status(200).send(rawFoods);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR());
    }
  });

  route.get('/get/:Id', async (req, res) => {
    try {
      const food = await FoodService.GetById(req.params.Id);
      res.status(200).send(food);
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
      const food = await FoodService.DeleteById(req.params.Id);
      res.status(200).send(food);
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
      const food = await FoodService.DeleteById(req.params.Id);
      res.status(200).send(food);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });
};
