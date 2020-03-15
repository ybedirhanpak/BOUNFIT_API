import { SchemaDefinition, SchemaOptions } from 'mongoose';

export const BaseModel: SchemaDefinition = {
  name: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
};

export const BaseOptions: SchemaOptions = {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
};

export enum Models {
    RAW_FOOD = 'RawFood',
    FOOD = 'Food',
    MEAL = 'Meal',
    DAILY_PLAN = 'DailyPlan',
    USER = 'User',
    RESTAURANT = 'Restaurant',
    GROCERY_STORE = 'GroceryStore'
}
