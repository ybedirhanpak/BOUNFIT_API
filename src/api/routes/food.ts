import { Router } from 'express';
import {
  FoodCreateDTO,
  AddIngredientDTO,
  UpdateIngredientDTO,
  RemoveIngredientDTO,
} from '../../interfaces/food';
import FoodService from '../../services/food';
import errors, { errorNames } from '../../helpers/errors';

const route = Router();

export default (app: Router) => {
  app.use('/foods', route);

  route.post('/create', async (req, res) => {
    try {
      const createDTO = req.body as FoodCreateDTO;
      const foods = await FoodService.Create(createDTO);
      res.status(200).send(foods);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND
        || err.name === errorNames.VALIDATION_ERROR) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.get('/getAll', async (req, res) => {
    try {
      const foods = await FoodService.GetAll();
      res.status(200).send(foods);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR(err));
    }
  });

  route.get('/getAllDeleted', async (req, res) => {
    try {
      const foods = await FoodService.GetAllDeleted();
      res.status(200).send(foods);
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

  route.post('/addIngredient/:Id', async (req, res) => {
    try {
      const food = await FoodService.AddIngredient(req.params.Id, req.body as AddIngredientDTO);
      res.status(200).send(food);
    } catch (err) {
      if (err.name === errorNames.FOOD_NOT_FOUND
          || err.name === errorNames.INVALID_INGREDIENT
          || err.name === errorNames.RAW_FOOD_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/updateIngredient/:Id', async (req, res) => {
    try {
      const food = await FoodService.UpdateIngredient(
        req.params.Id,
        req.body as UpdateIngredientDTO,
      );
      res.status(200).send(food);
    } catch (err) {
      if (err.name === errorNames.FOOD_NOT_FOUND
          || err.name === errorNames.INGREDIENT_NOT_FOUND
          || err.name === errorNames.INVALID_INGREDIENT) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/removeIngredient/:Id', async (req, res) => {
    try {
      const food = await FoodService.RemoveIngredient(
        req.params.Id,
        req.body as RemoveIngredientDTO,
      );
      res.status(200).send(food);
    } catch (err) {
      if (err.name === errorNames.FOOD_NOT_FOUND
          || err.name === errorNames.INGREDIENT_NOT_FOUND
          || err.name === errorNames.INVALID_INGREDIENT) {
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
      const food = await FoodService.RestoreById(req.params.Id);
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
