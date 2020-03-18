import { Router } from 'express';
import {
  RawFoodCreateDTO,
  RawFoodUpdateDTO,
} from '../../interfaces/rawFood';
import RawFoodService from '../../services/rawFood';
import errors, { errorNames } from '../../helpers/errors';

const route = Router();

export default (app: Router) => {
  app.use('/rawFoods', route);

  route.post('/create', async (req, res) => {
    try {
      const createDTO = req.body as RawFoodCreateDTO;
      const rawFoods = await RawFoodService.Create(createDTO);
      res.status(200).send(rawFoods);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND
        || err.name === errorNames.INVALID_RAW_FOOD
        || err.name === errorNames.VALIDATION_ERROR) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.get('/getAll', async (req, res) => {
    try {
      const rawFoods = await RawFoodService.GetAll();
      res.status(200).send(rawFoods);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR(err));
    }
  });

  route.get('/getAllDeleted', async (req, res) => {
    try {
      const rawFoods = await RawFoodService.GetAllDeleted();
      res.status(200).send(rawFoods);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR());
    }
  });

  route.get('/get/:Id', async (req, res) => {
    try {
      const food = await RawFoodService.GetById(req.params.Id);
      res.status(200).send(food);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/update/:Id', async (req, res) => {
    try {
      const food = await RawFoodService.UpdateById(req.params.Id, req.body as RawFoodUpdateDTO);
      res.status(200).send(food);
    } catch (err) {
      if (err.name === errorNames.RAW_FOOD_NOT_FOUND
        || err.name === errorNames.INVALID_RAW_FOOD) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/delete/:Id', async (req, res) => {
    try {
      const food = await RawFoodService.DeleteById(req.params.Id);
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
      const food = await RawFoodService.RestoreById(req.params.Id);
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
