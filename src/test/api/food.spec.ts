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

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;
const INVALID_ID = '1a1111aa111aa11aaaaaa1a1';

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

  it('/getAll: should return status 200', () => {
    chai.request(app).get('/api/foods/getAll')
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.an('array', 'of foods');
        res.body.forEach((element: any) => {
          expect(element).to.have.property('isDeleted', false);
        });
      });
  });

  it('/getAllDeleted: should return status 200', () => {
    chai.request(app).get('/api/foods/getAllDeleted')
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.an('array', 'of foods');
        res.body.forEach((element: any) => {
          expect(element).to.have.property('isDeleted', true);
        });
      });
  });

  it('/get/:Id : invalid id should return status 400', () => {
    chai.request(app).get(`/api/foods/get/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
      });
  });

  it('/delete/:Id : invalid id should return status 400', () => {
    chai.request(app).post(`/api/foods/delete/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
      });
  });

  it('/restore/:Id : invalid id should return status 400', () => {
    chai.request(app).post(`/api/foods/restore/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
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

describe('Rawfood Api Self Dependent Tests', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });
});
