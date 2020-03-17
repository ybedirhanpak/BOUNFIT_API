import { Router } from 'express';
import {
  GroceryStoreCreateDTO,
  AddRemoveRawFoodDTO,
} from '../../interfaces/groceryStore';
import errors, { errorNames } from '../../helpers/errors';
import GroceryStoreService from '../../services/groceryStore';

const route = Router();

export default (app: Router) => {
  app.use('/groceryStores', route);

  route.post('/create', async (req, res) => {
    try {
      const createDTO = req.body as GroceryStoreCreateDTO;
      const groceryStores = await GroceryStoreService.Create(createDTO);
      res.status(200).send(groceryStores);
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
      const groceryStores = await GroceryStoreService.GetAll();
      res.status(200).send(groceryStores);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR(err));
    }
  });

  route.get('/getAllDeleted', async (req, res) => {
    try {
      const groceryStores = await GroceryStoreService.GetAllDeleted();
      res.status(200).send(groceryStores);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR());
    }
  });

  route.get('/get/:Id', async (req, res) => {
    try {
      const groceryStore = await GroceryStoreService.GetById(req.params.Id);
      res.status(200).send(groceryStore);
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
      const groceryStore = await GroceryStoreService.DeleteById(req.params.Id);
      res.status(200).send(groceryStore);
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
      const groceryStore = await GroceryStoreService.RestoreById(req.params.Id);
      res.status(200).send(groceryStore);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/addRawFood/:Id', async (req, res) => {
    try {
      const addRawFoodDTO = req.body as AddRemoveRawFoodDTO;
      const groceryStore = await GroceryStoreService.AddRawFood(req.params.Id, addRawFoodDTO);
      res.status(200).send(groceryStore);
    } catch (err) {
      if (err.name === errorNames.GROCERY_STORE_NOT_FOUND
          || err.name === errorNames.RAW_FOOD_NOT_FOUND
          || err.name === errorNames.FOOD_ALREADY_EXISTS
          || err.name === errorNames.VALIDATION_ERROR) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/removeRawFood/:Id', async (req, res) => {
    try {
      const removeFoodDTO = req.body as AddRemoveRawFoodDTO;
      const groceryStore = await GroceryStoreService.RemoveRawFood(req.params.Id, removeFoodDTO);
      res.status(200).send(groceryStore);
    } catch (err) {
      if (err.name === errorNames.GROCERY_STORE_NOT_FOUND
          || err.name === errorNames.RAW_FOOD_NOT_FOUND
          || err.name === errorNames.VALIDATION_ERROR) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });
};
