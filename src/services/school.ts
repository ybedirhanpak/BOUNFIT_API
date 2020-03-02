import { parse } from 'node-html-parser';
import fetch from 'isomorphic-unfetch';
import { ISchoolFood, ISchoolMeal } from "../interfaces/school";

const getCurrentHTML = async () => {
    const response = await fetch("https://yemekhane.boun.edu.tr/");
    return response.text();
}

const parseMeal = async (mealHTML: HTMLElement): Promise<ISchoolMeal> => {
    let meal = {};
    const foods = ["soup", "maincourse", "vegetarien", "complementary"];
    for (let food of foods) {
        //Parse food other than selectives
        const foodHTML = mealHTML.querySelector(`.food-container.${food} .field-content a`);
        if (foodHTML) {
            const schoolFood: ISchoolFood = {
                name: foodHTML.innerHTML,
                slug: foodHTML.getAttribute("href") ?? ""
            }
            //Add food to meal
            meal = {
                ...meal,
                [food]: schoolFood
            }
        }
    }
    //Parse selectives
    const selectiveHTML = mealHTML.querySelectorAll(`.food-container.selective .field-content .item-list ul li a`);
    let selective: ISchoolFood[] = [];
    selectiveHTML.forEach((element) => {
        selective.push({
            name: element.innerHTML,
            slug: element.getAttribute("href") ?? ""
        })
    });

    //Add selectives to meal
    meal = {
        ...meal,
        selectives: selective
    }

    return (meal as ISchoolMeal);
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
