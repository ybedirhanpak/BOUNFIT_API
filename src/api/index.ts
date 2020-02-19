import { Router } from 'express';
import food from './routes/food';
import meal from './routes/meal';
import dailyPlan from './routes/dailyPlan';
import groceryStore from './routes/groceryStore';
import restaurant from './routes/restaurant';

export default () => {
    const app = Router();
    //Save routes
    food(app);
    meal(app);
    dailyPlan(app);
    groceryStore(app);
    restaurant(app);

    return app;
}