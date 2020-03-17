import chai from 'chai';
import { describe, it } from 'mocha';
import { Types } from 'mongoose';
import app from '../../app';
import { FoodCreateDTO, FoodModel, AddIngredientDTO } from '../../interfaces/food';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';
import { RawFoodCreateDTO } from '../../interfaces/rawFood';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('Food Integration Cases', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('Create with ingredients', async () => {
    const rawFood1: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 1,
      carb: 2,
      fat: 3,
      calories: 4,
    };

    const rawFood2: RawFoodCreateDTO = {
      name: 'raw food 2',
      protein: 5,
      carb: 6,
      fat: 7,
      calories: 8,
    };

    const quantity1 = 100;
    const quantity2 = 200;

    const res1 = await chai.request(app).post('/api/rawFoods/create')
      .send(rawFood1);

    expect(res1).to.have.property('status', 200);
    expect(res1.body).to.have.property('name', 'raw food 1');

    const res2 = await chai.request(app).post('/api/rawFoods/create')
      .send(rawFood2);

    expect(res1).to.have.property('status', 200);
    expect(res2.body).to.have.property('name', 'raw food 2');

    const foodCreate: FoodCreateDTO = {
      name: 'food 1',
      ingredients: [
        {
          quantity: quantity1,
          rawFood: res1.body._id,
        },
        {
          quantity: quantity2,
          rawFood: res2.body._id,
        },
      ],
    };

    const res3 = await chai.request(app).post('/api/foods/create')
      .send(foodCreate);

    expect(res3).to.have.property('status', 200);
    expect(res3.body).to.have.property('name', 'food 1');
    expect(res3.body).to.have.property('ingredients').to.be.an('array');
    expect(res3.body.ingredients).to.eql([
      {
        quantity: quantity1,
        rawFood: res1.body._id,
      },
      {
        quantity: quantity2,
        rawFood: res2.body._id,
      },
    ]);
    expect(res3.body).to.have.property('total').to.eql({
      values: {
        protein: rawFood1.protein * (quantity1 / 100) + rawFood2.protein * (quantity2 / 100),
        carb: rawFood1.carb * (quantity1 / 100) + rawFood2.carb * (quantity2 / 100),
        fat: rawFood1.fat * (quantity1 / 100) + rawFood2.fat * (quantity2 / 100),
        calories: rawFood1.calories * (quantity1 / 100) + rawFood2.calories * (quantity2 / 100),
      },
      quantity: quantity1 + quantity2,
    });
  });

  it('Add ingredient', async () => {
    const rawFood: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 10,
      carb: 20,
      fat: 30,
      calories: 40,
    };
    const rawFoodQuantity = 150;

    const res1 = await chai.request(app).post('/api/rawFoods/create')
      .send(rawFood);

    expect(res1).to.have.property('status', 200);
    expect(res1.body).to.have.property('_id');
    expect(res1.body).to.have.property('name', 'raw food 1');
    const rawFoodId = res1.body._id;

    const res2 = await chai.request(app).get('/api/foods/getAll');

    expect(res2).to.have.property('status', 200);
    expect(res2.body).to.be.an('array');
    const food = res2.body[0];
    expect(food).to.have.property('_id');
    expect(food).to.have.property('name', 'food 1');

    const addIngredientDTO: AddIngredientDTO = {
      ingredient: {
        rawFood: rawFoodId,
        quantity: rawFoodQuantity,
      },
    };

    const res3 = await chai.request(app).post(`/api/foods/addIngredient/${food._id}`)
      .send(addIngredientDTO);
    expect(res3.body).to.have.property('name', 'food 1');
    expect(res3.body).to.have.property('ingredients').to.be.an('array').to.eql([
      ...food.ingredients,
      {
        ...addIngredientDTO.ingredient,
      },
    ]);
    expect(res3.body).to.have.property('total').to.eql({
      values: {
        protein: food.total.values.protein + rawFood.protein * (rawFoodQuantity / 100),
        carb: food.total.values.carb + rawFood.carb * (rawFoodQuantity / 100),
        fat: food.total.values.fat + rawFood.fat * (rawFoodQuantity / 100),
        calories: food.total.values.calories + rawFood.calories * (rawFoodQuantity / 100),
      },
      quantity: food.total.quantity + rawFoodQuantity,
    });
  });
});
