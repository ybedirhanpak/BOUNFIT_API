import { Document, Model } from 'mongoose';
import { IFoodModel } from '../../interfaces/food';

declare global {
    namespace Models {
        export type FoodModel = Model<IFoodModel & Document>;
    }
}