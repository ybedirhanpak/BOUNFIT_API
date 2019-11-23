import { Router } from 'express';
import food from './routes/food';
import meal from './routes/meal';
import dailyPlan from './routes/dailyPlan';

export default () => {
    const app = Router();
    //Save routes
    food(app);
    meal(app);
    dailyPlan(app);

    return app;
}