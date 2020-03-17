import { Router } from 'express';
import {
  DailyPlanCreateDTO,
  AddRemoveMealDTO,
} from '../../interfaces/dailyPlan';
import errors, { errorNames } from '../../helpers/errors';
import DailyPlanService from '../../services/dailyPlan';

const route = Router();

export default (app: Router) => {
  app.use('/dailyPlans', route);

  route.post('/create', async (req, res) => {
    try {
      const createDTO = req.body as DailyPlanCreateDTO;
      const dailyPlans = await DailyPlanService.Create(createDTO);
      res.status(200).send(dailyPlans);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR(err));
    }
  });

  route.get('/getAll', async (req, res) => {
    try {
      const dailyPlans = await DailyPlanService.GetAll();
      res.status(200).send(dailyPlans);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR(err));
    }
  });

  route.get('/getAllDeleted', async (req, res) => {
    try {
      const dailyPlans = await DailyPlanService.GetAllDeleted();
      res.status(200).send(dailyPlans);
    } catch (err) {
      res.status(500).send(errors.INTERNAL_ERROR());
    }
  });

  route.get('/get/:Id', async (req, res) => {
    try {
      const dailyPlan = await DailyPlanService.GetById(req.params.Id);
      res.status(200).send(dailyPlan);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.get('/getWithMeals/:Id', async (req, res) => {
    try {
      const dailyPlan = await DailyPlanService.GetWithMeals(req.params.Id);
      res.status(200).send(dailyPlan);
    } catch (err) {
      if (err.name === errorNames.DAILY_PLAN_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/delete/:Id', async (req, res) => {
    try {
      const dailyPlan = await DailyPlanService.DeleteById(req.params.Id);
      res.status(200).send(dailyPlan);
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
      const dailyPlan = await DailyPlanService.RestoreById(req.params.Id);
      res.status(200).send(dailyPlan);
    } catch (err) {
      if (err.name === errorNames.INSTANCE_NOT_FOUND) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/addMeal/:Id', async (req, res) => {
    try {
      const addMealDTO = req.body as AddRemoveMealDTO;
      const dailyPlan = await DailyPlanService.AddMeal(req.params.Id, addMealDTO);
      res.status(200).send(dailyPlan);
    } catch (err) {
      if (err.name === errorNames.DAILY_PLAN_NOT_FOUND
          || err.name === errorNames.INSTANCE_NOT_FOUND
          || err.name === errorNames.MEAL_ALREADY_EXISTS
          || err.name === errorNames.VALIDATION_ERROR) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });

  route.post('/removeMeal/:Id', async (req, res) => {
    try {
      const removeMealDTO = req.body as AddRemoveMealDTO;
      const dailyPlan = await DailyPlanService.RemoveMeal(req.params.Id, removeMealDTO);
      res.status(200).send(dailyPlan);
    } catch (err) {
      if (err.name === errorNames.DAILY_PLAN_NOT_FOUND
          || err.name === errorNames.INSTANCE_NOT_FOUND
          || err.name === errorNames.MEAL_NOT_FOUND
          || err.name === errorNames.VALIDATION_ERROR) {
        res.status(400).send(err);
      } else {
        res.status(500).send(errors.INTERNAL_ERROR(err));
      }
    }
  });
};
