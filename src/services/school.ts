import { parse } from 'node-html-parser';
import fetch from 'isomorphic-unfetch';
import { ISchoolFood, ISchoolMeal, ISchoolCourse } from "../interfaces/school";

const getCurrentHTML = async () => {
    const response = await fetch("https://yemekhane.boun.edu.tr/");
    return response.text();
}

const parseMeal = async (mealHTML: HTMLElement): Promise<ISchoolMeal> => {
    let meal = {};
    // These will provide a single course. They include calories
    const courses = ["soup", "maincourse", "vegetarien"];
    // These will provide a list of foods don't include calories. 
    const foods = ["complementary", "selective"];

    for (let course of courses) {
        const schoolCourse = await parseCourse(mealHTML, course);
        meal = {
            ...meal,
            [course]: schoolCourse
        }
    }

    for (let food of foods) {
        const foodList = await parseFoodList(mealHTML, food);
        meal = {
            ...meal,
            [food]: foodList
        }
    }

    return (meal as ISchoolMeal);
}

const parseCourse = async (mealHTML: HTMLElement, course: string) => {
    let schoolCourse: ISchoolCourse = {
        name: "",
        slug: "",
        calories: ""
    }

    const courseHTML = mealHTML.querySelector(`.food-container.${course} .field-content a`);
    if (courseHTML) {
        schoolCourse = {
            ...schoolCourse,
            name: courseHTML.innerHTML,
            slug: courseHTML.getAttribute("href") ?? "",
        }
    }

    const caloriesHTML = mealHTML.querySelector(`.food-container.${course} .calories .field-content`)
    if (caloriesHTML) {
        schoolCourse = {
            ...schoolCourse,
            calories: caloriesHTML.innerHTML
        }
    }

    return schoolCourse;
}

const parseFoodList = async (mealHTML: HTMLElement, food: string) => {
    const foodHTML = mealHTML.querySelectorAll(`.food-container.${food} .field-content .item-list ul li a`);
    let foodList: ISchoolFood[] = [];
    foodHTML.forEach((element) => {
        foodList.push({
            name: element.innerHTML,
            slug: element.getAttribute("href") ?? ""
        })
    });
    return foodList;
}

const getCurrentSchoolMeals = async () => {
    const HTML = await getCurrentHTML();
    const root = parse(HTML);
    const lunchHTML = (root as any).querySelector("#block-views-yemek-block");
    const lunch = await parseMeal(lunchHTML);
    const dinnerHTML = (root as any).querySelector("#block-views-yemek-block-1");
    const dinner = await parseMeal(dinnerHTML);

    return {
        lunch,
        dinner
    };
}

export default {
    getCurrentSchoolMeals
}
