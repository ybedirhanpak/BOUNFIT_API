import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../../app';
import {
  FoodCreateDTO,
  AddIngredientDTO,
  RemoveIngredientDTO,
  UpdateIngredientDTO,
  FoodModel,
} from '../../interfaces/food';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';
import { BaseApiIndependentTests, BaseApiSelfDependentTests } from '../helpers/baseTests';
import { RawFoodCreateDTO, RawFoodModel } from '../../interfaces/rawFood';
import { Ingredient } from '../../interfaces/ingredient';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;
const INVALID_ID = '1a1111aa111aa11aaaaaa1a1';

describe('Food Base Api Independent Tests', () => {
  BaseApiIndependentTests('foods');
});

describe('Food Base Api Self Dependent Tests', () => {
  const createDTO: FoodCreateDTO = {
    name: 'food 1',
  };

  BaseApiSelfDependentTests('foods', createDTO);
});

describe('Food Api Independent Tests', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('/create: createDTO without ingredients should return status 200', () => {
    const createDTO: FoodCreateDTO = {
      name: 'food 1',
    };
    chai.request(app).post('/api/foods/create')
      .send(createDTO)
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.have.property('name', 'food 1');
        expect(res.body).to.have.property('_id');
        expect(res.body.ingredients).to.be.an('array');
      });
  });

  it('/create: createDTO without a name should return status 400', async () => {
    const createDTO = {
    };

    chai.request(app).post('/api/foods/create')
      .send(createDTO)
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.VALIDATION_ERROR);
      });
  });

  it('/addIngredient/:Id : invalid id should return status 400', () => {
    chai.request(app).post(`/api/foods/addIngredient/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.FOOD_NOT_FOUND);
      });
  });

  it('/updateIngredient/:Id : invalid id should return status 400', () => {
    chai.request(app).post(`/api/foods/updateIngredient/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.FOOD_NOT_FOUND);
      });
  });

  it('/removeIngredient/:Id : invalid id should return status 400', () => {
    chai.request(app).post(`/api/foods/removeIngredient/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.FOOD_NOT_FOUND);
      });
  });
});

describe('Food Api Self Dependent Tests', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });
});

describe('Food Api Dependent Tests', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  const createRawFood = async (createDTO: any) => {
    const rawFoodCreateDTO: RawFoodCreateDTO = createDTO ?? {
      name: 'raw food 1',
      protein: 11,
      carb: 12,
      fat: 13,
      calories: 14,
    };

    const createRes = await chai.request(app).post('/api/rawFoods/create')
      .send(rawFoodCreateDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood: RawFoodModel = createRes.body;
    expect(rawFood).to.include(rawFoodCreateDTO);

    return rawFood;
  };

  it('/create : invalid ingredient in creation with ingredients should return status 400', async () => {
    const rawFoodCreateDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 11,
      carb: 12,
      fat: 13,
      calories: 14,
    };

    const rawFood: RawFoodModel = await createRawFood(rawFoodCreateDTO);

    const foodCreateDTO: FoodCreateDTO = {
      name: 'food 1',
      ingredients: [
        {
          quantity: 100,
          rawFood: rawFood._id as any,
        },
        {
          quantity: 100,
          rawFood: INVALID_ID,
        },
      ],
    };

    const createRes3 = await chai.request(app).post('/api/foods/create')
      .send(foodCreateDTO);
    expect(createRes3).to.have.property('status', 400);
    expect(createRes3.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
  });

  it('/create : successful creation with ingredients should return status 200', async () => {
    const rawFoodCreateDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 11,
      carb: 12,
      fat: 13,
      calories: 14,
    };

    const rawFood1: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity1 = 100;

    const rawFood2: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity2 = 100;

    const foodCreateDTO: FoodCreateDTO = {
      name: 'food 1',
      ingredients: [
        {
          quantity: quantity1,
          rawFood: rawFood1._id as any,
        },
        {
          quantity: quantity2,
          rawFood: rawFood2._id as any,
        },
      ],
    };

    const createRes3 = await chai.request(app).post('/api/foods/create')
      .send(foodCreateDTO);
    expect(createRes3).to.have.property('status', 200);
    const food: FoodModel = createRes3.body;
    expect(food).to.have.property('_id');
    expect(food).to.have.property('name', foodCreateDTO.name);
    expect(food.ingredients).to.be.an('array').to.eql(foodCreateDTO.ingredients);
    expect(food.total).to.eql({
      values: {
        protein: rawFood1.protein * (quantity1 / 100) + rawFood2.protein * (quantity2 / 100),
        carb: rawFood1.carb * (quantity1 / 100) + rawFood2.carb * (quantity2 / 100),
        fat: rawFood1.fat * (quantity1 / 100) + rawFood2.fat * (quantity2 / 100),
        calories: rawFood1.calories * (quantity1 / 100) + rawFood2.calories * (quantity2 / 100),
      },
      quantity: quantity1 + quantity2,
    });
  });

  it('/addIngredient/:Id : addition of an invalid ingredient should return status 400', async () => {
    const rawFoodCreateDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 11,
      carb: 12,
      fat: 13,
      calories: 14,
    };
    // Create a rawFood first
    const rawFood1: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity1 = 100;

    const foodCreateDTO: FoodCreateDTO = {
      name: 'food 1',
    };
    // Create a food
    const createRes3 = await chai.request(app).post('/api/foods/create')
      .send(foodCreateDTO);
    expect(createRes3).to.have.property('status', 200);
    const food: FoodModel = createRes3.body;
    expect(food).to.have.property('_id');
    expect(food).to.have.property('name', foodCreateDTO.name);
    expect(food.ingredients).to.be.an('array');

    const updateDTO: AddIngredientDTO = {
      ingredient: {
        rawFood: rawFood1._id as any,
        quantity: quantity1,
      },
    };

    // Add with undefined ingredient
    const updateRes1 = await chai.request(app).post(`/api/foods/addIngredient/${food._id}`)
      .send({});
    expect(updateRes1).to.have.property('status', 400);
    expect(updateRes1.body).to.have.property('name', errorNames.INVALID_INGREDIENT);

    // Add ingredient with undefined id
    const updateRes2 = await chai.request(app).post(`/api/foods/addIngredient/${food._id}`)
      .send({
        ingredient: {
          quantity: quantity1,
        },
      });
    expect(updateRes2).to.have.property('status', 400);
    expect(updateRes2.body).to.have.property('name', errorNames.INVALID_INGREDIENT);

    // Add ingredient with undefined quantity
    const updateRes3 = await chai.request(app).post(`/api/foods/addIngredient/${food._id}`)
      .send({
        ingredient: {
          rawFood: rawFood1._id as any,
        },
      });
    expect(updateRes3).to.have.property('status', 400);
    expect(updateRes3.body).to.have.property('name', errorNames.INVALID_INGREDIENT);

    // Add ingredient with negative quantity
    const updateRes4 = await chai.request(app).post(`/api/foods/addIngredient/${food._id}`)
      .send({
        ingredient: {
          ...updateDTO.ingredient,
          quantity: -10,
        },
      });
    expect(updateRes4).to.have.property('status', 400);
    expect(updateRes4.body).to.have.property('name', errorNames.INVALID_INGREDIENT);


    // Add ingredient with invalid id.
    const updateRes5 = await chai.request(app).post(`/api/foods/addIngredient/${food._id}`)
      .send({
        ingredient: {
          ...updateDTO.ingredient,
          rawFood: INVALID_ID,
        },
      });
    expect(updateRes5).to.have.property('status', 400);
    expect(updateRes5.body).to.have.property('name', errorNames.RAW_FOOD_NOT_FOUND);
  });

  it('/addIngredient/:Id : successful addition of an ingredient should return status 200', async () => {
    const rawFoodCreateDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 11,
      carb: 12,
      fat: 13,
      calories: 14,
    };

    const rawFood1: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity1 = 100;

    const rawFood2: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity2 = 100;

    const foodCreateDTO: FoodCreateDTO = {
      name: 'food 1',
      ingredients: [
        {
          quantity: quantity1,
          rawFood: rawFood1._id as any,
        },
      ],
    };

    const createRes3 = await chai.request(app).post('/api/foods/create')
      .send(foodCreateDTO);
    expect(createRes3).to.have.property('status', 200);
    const food: FoodModel = createRes3.body;
    expect(food).to.have.property('_id');
    expect(food).to.have.property('name', foodCreateDTO.name);
    expect(food.ingredients).to.be.an('array').to.eql(foodCreateDTO.ingredients);
    expect(food.total).to.eql({
      values: {
        protein: rawFood1.protein * (quantity1 / 100),
        carb: rawFood1.carb * (quantity1 / 100),
        fat: rawFood1.fat * (quantity1 / 100),
        calories: rawFood1.calories * (quantity1 / 100),
      },
      quantity: quantity1,
    });

    const updateDTO: AddIngredientDTO = {
      ingredient: {
        rawFood: rawFood2._id as any,
        quantity: quantity2,
      },
    };

    const updateRes = await chai.request(app).post(`/api/foods/addIngredient/${food._id}`)
      .send(updateDTO);
    expect(updateRes).to.have.property('status', 200);
    const updatedFood: FoodModel = updateRes.body;
    expect(updatedFood).to.have.property('name', food.name);
    expect(updatedFood.ingredients).to.be.an('array').to.eql([
      ...food.ingredients,
      {
        rawFood: rawFood2._id as any,
        quantity: quantity2,
      },
    ]);
    expect(updatedFood.total).to.eql({
      values: {
        protein: rawFood1.protein * (quantity1 / 100) + rawFood2.protein * (quantity2 / 100),
        carb: rawFood1.carb * (quantity1 / 100) + rawFood2.carb * (quantity2 / 100),
        fat: rawFood1.fat * (quantity1 / 100) + rawFood2.fat * (quantity2 / 100),
        calories: rawFood1.calories * (quantity1 / 100) + rawFood2.calories * (quantity2 / 100),
      },
      quantity: quantity1 + quantity2,
    });
  });

  it('/addIngredient/:Id : successful addition of an existing ingredient should return status 200', async () => {
    const rawFoodCreateDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 11,
      carb: 12,
      fat: 13,
      calories: 14,
    };

    const rawFood1: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity1 = 100;

    const rawFood2: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity2 = 200;

    const foodCreateDTO: FoodCreateDTO = {
      name: 'food 1',
      ingredients: [
        {
          quantity: quantity1,
          rawFood: rawFood1._id as any,
        },
        {
          quantity: quantity2,
          rawFood: rawFood2._id as any,
        },
      ],
    };

    const createRes3 = await chai.request(app).post('/api/foods/create')
      .send(foodCreateDTO);
    expect(createRes3).to.have.property('status', 200);
    const food: FoodModel = createRes3.body;
    expect(food).to.have.property('_id');
    expect(food).to.have.property('name', foodCreateDTO.name);
    expect(food.ingredients).to.be.an('array').to.eql(foodCreateDTO.ingredients);
    expect(food.total).to.eql({
      values: {
        protein: rawFood1.protein * (quantity1 / 100) + rawFood2.protein * (quantity2 / 100),
        carb: rawFood1.carb * (quantity1 / 100) + rawFood2.carb * (quantity2 / 100),
        fat: rawFood1.fat * (quantity1 / 100) + rawFood2.fat * (quantity2 / 100),
        calories: rawFood1.calories * (quantity1 / 100) + rawFood2.calories * (quantity2 / 100),
      },
      quantity: quantity1 + quantity2,
    });

    const quantity3 = 50;
    const updateDTO: AddIngredientDTO = {
      ingredient: {
        rawFood: rawFood1._id as any,
        quantity: quantity3,
      },
    };

    const updateRes = await chai.request(app).post(`/api/foods/addIngredient/${food._id}`)
      .send(updateDTO);
    expect(updateRes).to.have.property('status', 200);
    const updatedFood: FoodModel = updateRes.body;
    expect(updatedFood).to.have.property('name', food.name);
    expect(updatedFood.ingredients).to.be.an('array').to.eql([
      {
        quantity: quantity1 + quantity3,
        rawFood: rawFood1._id as any,
      },
      {
        quantity: quantity2,
        rawFood: rawFood2._id as any,
      },
    ]);
    expect(updatedFood.total).to.eql({
      values: {
        protein: rawFood1.protein * ((quantity1 + quantity3) / 100)
          + rawFood2.protein * (quantity2 / 100),
        carb: rawFood1.carb * ((quantity1 + quantity3) / 100)
          + rawFood2.carb * (quantity2 / 100),
        fat: rawFood1.fat * ((quantity1 + quantity3) / 100)
          + rawFood2.fat * (quantity2 / 100),
        calories: rawFood1.calories * ((quantity1 + quantity3) / 100)
          + rawFood2.calories * (quantity2 / 100),
      },
      quantity: quantity1 + quantity2 + quantity3,
    });
  });

  it('/updateIngredient/:Id : successful update of an existing ingredient should return status 200', async () => {
    const rawFoodCreateDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 11,
      carb: 12,
      fat: 13,
      calories: 14,
    };

    const rawFood1: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity1 = 100;

    const foodCreateDTO: FoodCreateDTO = {
      name: 'food 1',
      ingredients: [
        {
          quantity: quantity1,
          rawFood: rawFood1._id as any,
        },
      ],
    };

    const createRes2 = await chai.request(app).post('/api/foods/create')
      .send(foodCreateDTO);
    expect(createRes2).to.have.property('status', 200);
    const food: FoodModel = createRes2.body;
    expect(food).to.have.property('_id');
    expect(food).to.have.property('name', foodCreateDTO.name);
    expect(food.ingredients).to.be.an('array').to.eql(foodCreateDTO.ingredients);
    expect(food.total).to.eql({
      values: {
        protein: rawFood1.protein * (quantity1 / 100),
        carb: rawFood1.carb * (quantity1 / 100),
        fat: rawFood1.fat * (quantity1 / 100),
        calories: rawFood1.calories * (quantity1 / 100),
      },
      quantity: quantity1,
    });

    const ingredient: Ingredient = food.ingredients[0];
    const newQuantity = 400;

    const updateDTO: UpdateIngredientDTO = {
      rawFoodId: ingredient.rawFood as any,
      quantity: newQuantity,
    };

    const updateRes = await chai.request(app).post(`/api/foods/updateIngredient/${food._id}`)
      .send(updateDTO);
    expect(updateRes).to.have.property('status', 200);
    const updatedFood: FoodModel = updateRes.body;
    expect(updatedFood).to.have.property('name', food.name);
    expect(updatedFood.ingredients).to.be.an('array').to.eql([
      {
        rawFood: rawFood1._id as any,
        quantity: newQuantity,
      },
    ]);
    expect(updatedFood.total).to.eql({
      values: {
        protein: rawFood1.protein * (newQuantity / 100),
        carb: rawFood1.carb * (newQuantity / 100),
        fat: rawFood1.fat * (newQuantity / 100),
        calories: rawFood1.calories * (newQuantity / 100),
      },
      quantity: newQuantity,
    });
  });

  it('/updateIngredient/:Id : update of and existing ingredient with invalid dto should return status 400', async () => {
    const rawFoodCreateDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 11,
      carb: 12,
      fat: 13,
      calories: 14,
    };

    const rawFood1: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity1 = 100;

    const foodCreateDTO: FoodCreateDTO = {
      name: 'food 1',
      ingredients: [
        {
          quantity: quantity1,
          rawFood: rawFood1._id as any,
        },
      ],
    };

    const createRes2 = await chai.request(app).post('/api/foods/create')
      .send(foodCreateDTO);
    expect(createRes2).to.have.property('status', 200);
    const food: FoodModel = createRes2.body;
    expect(food).to.have.property('_id');
    expect(food).to.have.property('name', foodCreateDTO.name);
    expect(food.ingredients).to.be.an('array').to.eql(foodCreateDTO.ingredients);
    expect(food.total).to.eql({
      values: {
        protein: rawFood1.protein * (quantity1 / 100),
        carb: rawFood1.carb * (quantity1 / 100),
        fat: rawFood1.fat * (quantity1 / 100),
        calories: rawFood1.calories * (quantity1 / 100),
      },
      quantity: quantity1,
    });

    const ingredient: Ingredient = food.ingredients[0];
    const newQuantity = 400;

    const updateDTO: UpdateIngredientDTO = {
      rawFoodId: ingredient.rawFood as any,
      quantity: newQuantity,
    };
    // Update with empty dto
    const updateRes = await chai.request(app).post(`/api/foods/updateIngredient/${food._id}`)
      .send({});
    expect(updateRes).to.have.property('status', 400);
    expect(updateRes.body).to.have.property('name', errorNames.INVALID_INGREDIENT);
    // Update with invalid id
    const updateRes2 = await chai.request(app).post(`/api/foods/updateIngredient/${food._id}`)
      .send({
        ...updateDTO,
        rawFoodId: INVALID_ID,
      });
    expect(updateRes2).to.have.property('status', 400);
    expect(updateRes2.body).to.have.property('name', errorNames.INGREDIENT_NOT_FOUND);
    // Update without quantity
    const updateRes3 = await chai.request(app).post(`/api/foods/updateIngredient/${food._id}`)
      .send({
        rawFoodId: ingredient.rawFood as any,
      });
    expect(updateRes3).to.have.property('status', 400);
    expect(updateRes3.body).to.have.property('name', errorNames.INVALID_INGREDIENT);
  });

  it('/removeIngredient/:Id : successful update of an existing ingredient should return status 200', async () => {
    const rawFoodCreateDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 11,
      carb: 12,
      fat: 13,
      calories: 14,
    };

    const rawFood1: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity1 = 100;

    const rawFood2: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity2 = 200;

    const foodCreateDTO: FoodCreateDTO = {
      name: 'food 1',
      ingredients: [
        {
          quantity: quantity1,
          rawFood: rawFood1._id as any,
        },
        {
          quantity: quantity2,
          rawFood: rawFood2._id as any,
        },
      ],
    };

    const createRes3 = await chai.request(app).post('/api/foods/create')
      .send(foodCreateDTO);
    expect(createRes3).to.have.property('status', 200);
    const food: FoodModel = createRes3.body;
    expect(food).to.have.property('_id');
    expect(food).to.have.property('name', foodCreateDTO.name);
    expect(food.ingredients).to.be.an('array').to.eql(foodCreateDTO.ingredients);
    expect(food.total).to.eql({
      values: {
        protein: rawFood1.protein * (quantity1 / 100) + rawFood2.protein * (quantity2 / 100),
        carb: rawFood1.carb * (quantity1 / 100) + rawFood2.carb * (quantity2 / 100),
        fat: rawFood1.fat * (quantity1 / 100) + rawFood2.fat * (quantity2 / 100),
        calories: rawFood1.calories * (quantity1 / 100) + rawFood2.calories * (quantity2 / 100),
      },
      quantity: quantity1 + quantity2,
    });

    const updateDTO: RemoveIngredientDTO = {
      rawFoodId: rawFood1._id as any,
    };

    const updateRes = await chai.request(app).post(`/api/foods/removeIngredient/${food._id}`)
      .send(updateDTO);
    expect(updateRes).to.have.property('status', 200);
    const updatedFood: FoodModel = updateRes.body;
    expect(updatedFood).to.have.property('name', food.name);
    expect(updatedFood.ingredients).to.be.an('array').to.eql([
      {
        quantity: quantity2,
        rawFood: rawFood2._id as any,
      },
    ]);
    expect(updatedFood.total).to.eql({
      values: {
        protein: rawFood2.protein * (quantity2 / 100),
        carb: rawFood2.carb * (quantity2 / 100),
        fat: rawFood2.fat * (quantity2 / 100),
        calories: rawFood2.calories * (quantity2 / 100),
      },
      quantity: quantity2,
    });
  });

  it('/removeIngredient/:Id : removal of and existing ingredient with invalid dto should return status 400', async () => {
    const rawFoodCreateDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 11,
      carb: 12,
      fat: 13,
      calories: 14,
    };

    const rawFood1: RawFoodModel = await createRawFood(rawFoodCreateDTO);
    const quantity1 = 100;

    const foodCreateDTO: FoodCreateDTO = {
      name: 'food 1',
      ingredients: [
        {
          quantity: quantity1,
          rawFood: rawFood1._id as any,
        },
      ],
    };

    const createRes2 = await chai.request(app).post('/api/foods/create')
      .send(foodCreateDTO);
    expect(createRes2).to.have.property('status', 200);
    const food: FoodModel = createRes2.body;
    expect(food).to.have.property('_id');
    expect(food).to.have.property('name', foodCreateDTO.name);
    expect(food.ingredients).to.be.an('array').to.eql(foodCreateDTO.ingredients);
    expect(food.total).to.eql({
      values: {
        protein: rawFood1.protein * (quantity1 / 100),
        carb: rawFood1.carb * (quantity1 / 100),
        fat: rawFood1.fat * (quantity1 / 100),
        calories: rawFood1.calories * (quantity1 / 100),
      },
      quantity: quantity1,
    });

    // Remove with empty dto
    const updateRes = await chai.request(app).post(`/api/foods/removeIngredient/${food._id}`)
      .send({});
    expect(updateRes).to.have.property('status', 400);
    expect(updateRes.body).to.have.property('name', errorNames.INVALID_INGREDIENT);
    // Update with invalid id
    const updateRes2 = await chai.request(app).post(`/api/foods/removeIngredient/${food._id}`)
      .send({
        rawFoodId: INVALID_ID,
      });
    expect(updateRes2).to.have.property('status', 400);
    expect(updateRes2.body).to.have.property('name', errorNames.INGREDIENT_NOT_FOUND);
  });
});
