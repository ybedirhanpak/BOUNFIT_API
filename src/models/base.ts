import { SchemaDefinition, SchemaOptions } from "mongoose";
export const BaseModel: SchemaDefinition = {
    name: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
};

export const BaseOptions: SchemaOptions = {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
}

export enum Models {
    food = "Food",
    meal = "Meal",
    dailyPlan = "DailyPlan",
    user = "User",
    restaurant = "Restaurant",
    groceryStore = "GroceryStore"
}
