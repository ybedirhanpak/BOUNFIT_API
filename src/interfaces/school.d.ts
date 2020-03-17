import { FoodModel } from './food';

export interface SchoolFoodModel extends FoodModel {
    slug: string;
    officialCalories: number;
}

export interface SchoolMealModel {
    soup: SchoolFoodModel;
    mainCourse: SchoolFoodModel;
    vegetarien: SchoolFoodModel;
    complementary: SchoolFoodModel[];
    selectives: SchoolFoodModel[];
}

export interface SchoolFood {
    name: string;
    slug: string;
}

export interface SchoolCourse extends SchoolFood{
    calories: string;
}

export interface SchoolMeal {
    soup: string;
    mainCourse: string;
    vegetarien: string;
    complementary: string[];
    selectives: string[];
}
