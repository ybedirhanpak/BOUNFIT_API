import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../../app';
import { RawFoodCreateDTO } from '../../interfaces/rawFood';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;
const INVALID_ID = '1a1111aa111aa11aaaaaa1a1';

describe('RawFood Api Independent Tests', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('/create: Valid createDTO should return status 200', () => {
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

  it('/create: Invalid createDTO should return status 400', async () => {
    const createDTO = {
      name: 'sample raw food',
      protein: 10,
      carb: 10,
      fat: 10,
      calories: 10,
    };

    chai.request(app).post('/api/rawFoods/create')
      .send({ ...createDTO, name: undefined })
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);
      });

    chai.request(app).post('/api/rawFoods/create')
      .send({ ...createDTO, protein: -10 })
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);
      });

    chai.request(app).post('/api/rawFoods/create')
      .send({ ...createDTO, carb: -10 })
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);
      });

    chai.request(app).post('/api/rawFoods/create')
      .send({ ...createDTO, fat: -10 })
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);
      });

    chai.request(app).post('/api/rawFoods/create')
      .send({ ...createDTO, calories: -10 })
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);
      });
  });

  it('/getAll: should return status 200', () => {
    chai.request(app).get('/api/rawFoods/getAll')
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.an('array', 'of raw foods');
        res.body.forEach((element: any) => {
          expect(element).to.have.property('isDeleted', false);
        });
      });
  });

  it('/getAllDeleted: should return status 200', () => {
    chai.request(app).get('/api/rawFoods/getAllDeleted')
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.an('array', 'of raw foods');
        res.body.forEach((element: any) => {
          expect(element).to.have.property('isDeleted', true);
        });
      });
  });

  it('/get/:Id : Invalid id should return status 400', () => {
    chai.request(app).get(`/api/rawFoods/get/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
      });
  });

  it('/delete/:Id : Invalid id should return status 400', () => {
    chai.request(app).post(`/api/rawFoods/delete/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
      });
  });

  it('/restore/:Id : Invalid id should return status 400', () => {
    chai.request(app).post(`/api/rawFoods/restore/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
      });
  });

  it('/update/:Id : Invalid id should return status 400', () => {
    chai.request(app).post(`/api/rawFoods/update/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.RAW_FOOD_NOT_FOUND);
      });
  });
});
