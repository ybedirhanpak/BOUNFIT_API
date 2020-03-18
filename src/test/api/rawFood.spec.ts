import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../../app';
import { RawFoodCreateDTO, RawFoodUpdateDTO, RawFoodModel } from '../../interfaces/rawFood';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';
import { BaseIndependetTests, BaseSelfDependentTests } from '../helpers/baseTests';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;
const INVALID_ID = '1a1111aa111aa11aaaaaa1a1';

describe('RawFood Api Independent Tests', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('/create: valid createDTO should return status 200', () => {
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

  it('/create: invalid createDTO should return status 400', async () => {
    const createDTO = {
      name: 'sample raw food',
      protein: 10,
      carb: 10,
      fat: 10,
      calories: 10,
    };

    chai.request(app).post('/api/rawFoods/create')
      .send({})
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.VALIDATION_ERROR);
      });

    chai.request(app).post('/api/rawFoods/create')
      .send({ ...createDTO, name: undefined })
      .then((res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('name', errorNames.VALIDATION_ERROR);
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

  it('/get/:Id : invalid id should return status 400', () => {
    chai.request(app).get(`/api/rawFoods/get/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
      });
  });

  it('/delete/:Id : invalid id should return status 400', () => {
    chai.request(app).post(`/api/rawFoods/delete/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
      });
  });

  it('/restore/:Id : invalid id should return status 400', () => {
    chai.request(app).post(`/api/rawFoods/restore/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
      });
  });

  it('/update/:Id : invalid id should return status 400', () => {
    chai.request(app).post(`/api/rawFoods/update/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.RAW_FOOD_NOT_FOUND);
      });
  });
});

describe('Rawfood Api Self Dependent Tests', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('/create , /get/:Id : successful get should return status 200', async () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0,
    };

    const createRes = await chai.request(app).post('/api/rawFoods/create')
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood = createRes.body;
    expect(rawFood).to.have.property('_id');
    expect(rawFood).to.include(createDTO);

    const getRes = await chai.request(app).get(`/api/rawFoods/get/${rawFood._id}`);
    expect(getRes).to.have.property('status', 200);
    const getRawFood = getRes.body;
    expect(getRawFood).to.have.property('_id', rawFood._id);
    expect(getRawFood).to.include(createDTO);
  });

  it('/create , /update/:Id : successful update should return status 200', async () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0,
    };

    const createRes = await chai.request(app).post('/api/rawFoods/create')
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood = createRes.body;
    expect(rawFood).to.have.property('_id');
    expect(rawFood).to.include(createDTO);

    const updateDTO: RawFoodUpdateDTO = {
      name: 'updated raw food',
      protein: 10,
      carb: 11,
      fat: 12,
      calories: 13,
    };

    const updateRes = await chai.request(app).post(`/api/rawFoods/update/${rawFood._id}`)
      .send(updateDTO);
    expect(updateRes).to.have.property('status', 200);
    const updatedRawFood = updateRes.body;
    expect(updatedRawFood).to.have.property('_id', rawFood._id);
    expect(updatedRawFood).to.include(updateDTO);
  });

  it('/create , /update/:Id : empty updateDTO should return status 200', async () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0,
    };

    const createRes = await chai.request(app).post('/api/rawFoods/create')
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood = createRes.body;
    expect(rawFood).to.have.property('_id');
    expect(rawFood).to.include(createDTO);

    const updateDTO = {
    };

    const updateRes = await chai.request(app).post(`/api/rawFoods/update/${rawFood._id}`)
      .send(updateDTO);
    expect(updateRes).to.have.property('status', 200);
    const updatedRawFood = updateRes.body;
    expect(updatedRawFood).to.have.property('_id', rawFood._id);
    expect(updatedRawFood).to.include(updateDTO);
  });

  it('/create , /update/:Id : invalid updateDTO should return status 400', async () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0,
    };

    const createRes = await chai.request(app).post('/api/rawFoods/create')
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood = createRes.body;
    expect(rawFood).to.have.property('_id');
    expect(rawFood).to.include(createDTO);

    const updateDTO: RawFoodUpdateDTO = {
      name: 'updated raw food',
      protein: 10,
      carb: 11,
      fat: 12,
      calories: 13,
    };

    const updateRes1 = await chai.request(app).post(`/api/rawFoods/update/${rawFood._id}`)
      .send({ ...updateDTO, protein: -10 });
    expect(updateRes1).to.have.property('status', 400);
    expect(updateRes1.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);

    const updateRes2 = await chai.request(app).post(`/api/rawFoods/update/${rawFood._id}`)
      .send({ ...updateDTO, protein: -10 });
    expect(updateRes2).to.have.property('status', 400);
    expect(updateRes2.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);

    const updateRes3 = await chai.request(app).post(`/api/rawFoods/update/${rawFood._id}`)
      .send({ ...updateDTO, protein: -10 });
    expect(updateRes3).to.have.property('status', 400);
    expect(updateRes3.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);

    const updateRes4 = await chai.request(app).post(`/api/rawFoods/update/${rawFood._id}`)
      .send({ ...updateDTO, protein: -10 });
    expect(updateRes4).to.have.property('status', 400);
    expect(updateRes4.body).to.have.property('name', errorNames.INVALID_RAW_FOOD);
  });

  it('/create , /getAll : successful get should return status 200', async () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0,
    };

    const createRes = await chai.request(app).post('/api/rawFoods/create')
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood = createRes.body;
    expect(rawFood).to.have.property('_id');
    expect(rawFood).to.include(createDTO);

    const getRes = await chai.request(app).get('/api/rawFoods/getAll');
    expect(getRes).to.have.property('status', 200);
    expect(getRes.body).to.be.an('array');
    getRes.body.forEach((r: RawFoodModel) => {
      expect(r).to.have.property('_id');
      expect(r).to.have.property('isDeleted', false);
    });
  });

  it('/create , /delete, /getAllDeleted, /restore : successful delete, restore should return status 200', async () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0,
    };

    const createRes = await chai.request(app).post('/api/rawFoods/create')
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood = createRes.body;
    expect(rawFood).to.have.property('_id');
    expect(rawFood).to.include(createDTO);

    const deleteRes = await chai.request(app).post(`/api/rawFoods/delete/${rawFood._id}`);
    expect(deleteRes).to.have.property('status', 200);
    const deletedRawFood = deleteRes.body;
    expect(deletedRawFood).to.have.property('_id', rawFood._id);
    expect(deletedRawFood).to.have.property('isDeleted', true);
    expect(deletedRawFood).to.include(createDTO);

    const getAllDeletedRes = await chai.request(app).get('/api/rawFoods/getAllDeleted');
    expect(getAllDeletedRes).to.have.property('status', 200);
    expect(getAllDeletedRes.body).to.be.an('array');
    getAllDeletedRes.body.forEach((r: RawFoodModel) => {
      expect(r).to.have.property('_id');
      expect(r).to.have.property('isDeleted', true);
    });

    const restoredRes = await chai.request(app).post(`/api/rawFoods/restore/${rawFood._id}`);
    expect(restoredRes).to.have.property('status', 200);
    const restoredRawFood = restoredRes.body;
    expect(restoredRawFood).to.have.property('_id', rawFood._id);
    expect(restoredRawFood).to.have.property('isDeleted', false);
    expect(restoredRawFood).to.include(createDTO);
  });

  it('/create , /delete, /getAllDeleted, /restore : invalid delete, restore should return status 400', async () => {
    const createDTO: RawFoodCreateDTO = {
      name: 'raw food 1',
      protein: 0,
      carb: 0,
      fat: 0,
      calories: 0,
    };
    // Create first
    const createRes = await chai.request(app).post('/api/rawFoods/create')
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood = createRes.body;
    expect(rawFood).to.have.property('_id');
    expect(rawFood).to.include(createDTO);
    // Delete once
    const deleteRes = await chai.request(app).post(`/api/rawFoods/delete/${rawFood._id}`);
    expect(deleteRes).to.have.property('status', 200);
    const deletedRawFood = deleteRes.body;
    expect(deletedRawFood).to.have.property('_id', rawFood._id);
    expect(deletedRawFood).to.have.property('isDeleted', true);
    expect(deletedRawFood).to.include(createDTO);
    // Cannot delete twice
    const deleteRes2 = await chai.request(app).post(`/api/rawFoods/delete/${rawFood._id}`);
    expect(deleteRes2).to.have.property('status', 400);
    expect(deleteRes2.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
    // Cannot delete some invalid id
    const deleteRes3 = await chai.request(app).post(`/api/rawFoods/delete/${INVALID_ID}`);
    expect(deleteRes3).to.have.property('status', 400);
    expect(deleteRes3.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
    // Restore once
    const restoreRes = await chai.request(app).post(`/api/rawFoods/restore/${rawFood._id}`);
    expect(restoreRes).to.have.property('status', 200);
    const restoredRawFood = restoreRes.body;
    expect(restoredRawFood).to.have.property('_id', rawFood._id);
    expect(restoredRawFood).to.have.property('isDeleted', false);
    expect(restoredRawFood).to.include(createDTO);
    // Cannot restore twice
    const restoreRes2 = await chai.request(app).post(`/api/rawFoods/restore/${rawFood._id}`);
    expect(restoreRes2).to.have.property('status', 400);
    expect(restoreRes2.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
  });
});
