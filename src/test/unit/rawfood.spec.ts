import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../../app';
import { RawFoodCreateDTO } from '../../interfaces/rawFood';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('RawFood Unit Cases', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('Create with valid dto', () => {
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
      });
  });

  it('Create with invalid protein', () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: -1,
      carb: 0,
      fat: 0,
      calories: 0,
    };
    chai.request(app).post('/api/rawFoods/create')
      .send(createDTO)
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);
      });
  });

  it('Create with invalid carb', () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 0,
      carb: -1,
      fat: 0,
      calories: 0,
    };
    chai.request(app).post('/api/rawFoods/create')
      .send(createDTO)
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);
      });
  });

  it('Create with invalid fat', () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 0,
      carb: 0,
      fat: -1,
      calories: 0,
    };
    chai.request(app).post('/api/rawFoods/create')
      .send(createDTO)
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);
      });
  });


  it('Create with invalid calories', () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 0,
      carb: 0,
      fat: 0,
      calories: -1,
    };
    chai.request(app).post('/api/rawFoods/create')
      .send(createDTO)
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);
      });
  });

  it('Create without name', () => {
    const createDTO = {
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0,
    };
    chai.request(app).post('/api/rawFoods/create')
      .send(createDTO)
      .then((res) => {
        expect(res.status).to.equal(500);
        expect(res.body).to.have.property('name', errorNames.INTERNAL_ERROR);
      });
  });

  it('Get all', () => {
    chai.request(app).get('/api/rawFoods/getAll')
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.an('array', 'of raw foods');
        res.body.forEach((element: any) => {
          expect(element).to.have.property('isDeleted', false);
        });
      });
  });
});
