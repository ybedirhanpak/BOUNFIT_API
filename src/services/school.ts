import { parse } from 'node-html-parser';
import fetch from 'isomorphic-unfetch';
import { SchoolFood, SchoolCourse, SchoolMeal } from '../interfaces/school';

const getCurrentHTML = async () => {
  const response = await fetch('https://yemekhane.boun.edu.tr/');
  return response.text();
};

const parseCourse = async (mealHTML: HTMLElement, course: string) => {
  let schoolCourse: SchoolCourse = {
    name: '',
    slug: '',
    calories: '',
  };

  const courseHTML = mealHTML.querySelector(`.food-container.${course} .field-content a`);
  if (courseHTML) {
    schoolCourse = {
      ...schoolCourse,
      name: courseHTML.innerHTML,
      slug: courseHTML.getAttribute('href') ?? '',
    };
  }

  const caloriesHTML = mealHTML.querySelector(`.food-container.${course} .calories .field-content`);
  if (caloriesHTML) {
    schoolCourse = {
      ...schoolCourse,
      calories: caloriesHTML.innerHTML,
    };
  }

  return schoolCourse;
};

const parseFoodList = async (mealHTML: HTMLElement, food: string) => {
  const foodHTML = mealHTML.querySelectorAll(`.food-container.${food} .field-content .item-list ul li a`);
  const foodList: SchoolFood[] = [];
  foodHTML.forEach((element) => {
    foodList.push({
      name: element.innerHTML,
      slug: element.getAttribute('href') ?? '',
    });
  });
  return foodList;
};

const parseMeal = async (mealHTML: HTMLElement): Promise<SchoolMeal> => {
  let meal = {};
  // These will provide a single course. They include calories
  const courses = ['soup', 'maincourse', 'vegetarien'];
  // These will provide a list of foods don't include calories.
  const foods = ['complementary', 'selective'];

  courses.forEach((course) => {
    parseCourse(mealHTML, course).then((schoolCourse) => {
      meal = {
        ...meal,
        [course]: schoolCourse,
      };
    });
  });

  foods.forEach((food) => {
    parseFoodList(mealHTML, food).then((foodList) => {
      meal = {
        ...meal,
        [food]: foodList,
      };
    });
  });

  return (meal as SchoolMeal);
};

const GetCurrentSchoolMeals = async () => {
  const HTML = await getCurrentHTML();
  const root = parse(HTML);
  const lunchHTML = (root as any).querySelector('#block-views-yemek-block');
  const lunch = await parseMeal(lunchHTML);
  const dinnerHTML = (root as any).querySelector('#block-views-yemek-block-1');
  const dinner = await parseMeal(dinnerHTML);

  return {
    lunch,
    dinner,
  };
};

export default {
  GetCurrentSchoolMeals,
};
