import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../../app';
import { RawFoodModel, RawFoodCreateDTO, RawFoodUpdateDTO } from '../../interfaces/rawFood';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('RawFood Integration Cases', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('Create -> Get', () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0,
    };
    chai.request(app).post('/api/rawFoods/create')
      .send(createDTO)
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.have.property('name', 'raw food 1');
        expect(res.body).to.have.property('_id');
        const id = res.body._id;
        chai.request(app).get(`/api/rawFoods/get/${id}`)
          .then((_res) => {
            expect(_res).to.have.property('status', 200);
            expect(_res.body).to.have.property('name', 'raw food 1');
          });
      });
  });

  it('GetAll -> Happy Update', () => {
    chai.request(app).get('/api/rawFoods/getAll')
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.an('array', 'of raw foods');
        const rawFoodSample = res.body[0];
        const updateDTO: RawFoodUpdateDTO = {
          name: 'raw food 2',
          protein: 1,
          carb: 2,
          fat: 4,
          calories: 3,
        };
        chai.request(app).post(`/api/rawFoods/update/${rawFoodSample._id}`)
          .send(updateDTO)
          .then((_res) => {
            expect(_res).to.have.property('status', 200);
            expect(_res.body).to.deep.include({
              _id: `${rawFoodSample._id}`,
              name: 'raw food 2',
              protein: 1,
              carb: 2,
              fat: 4,
              calories: 3,
            });
          });
      });
  });

  it('GetAll -> Invalid Update', () => {
    chai.request(app).get('/api/rawFoods/getAll')
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.an('array', 'of raw foods');
        const rawFoodSample = res.body[0];
        const updateDTO: RawFoodUpdateDTO = {
          name: 'raw food 2',
          protein: -1,
          carb: 2,
          fat: 4,
          calories: 3,
        };
        chai.request(app).post(`/api/rawFoods/update/${rawFoodSample._id}`)
          .send(updateDTO)
          .then((_res) => {
            expect(_res).to.have.property('status', 400);
            expect(_res.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);
          });
        chai.request(app).post('/api/rawFoods/update/someInvalidId')
          .send(updateDTO)
          .then((_res) => {
            expect(_res).to.have.property('status', 500);
            expect(_res.body).to.have.property('name', errorNames.INTERNAL_ERROR);
          });
        chai.request(app).post('/api/rawFoods/update/111111111111111111111111')
          .send(updateDTO)
          .then((_res) => {
            expect(_res).to.have.property('status', 400);
            expect(_res.body).to.have.property('name', errorNames.RAW_FOOD_NOT_FOUND);
          });
      });
  });
});
