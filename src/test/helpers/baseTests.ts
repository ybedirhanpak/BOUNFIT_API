import chai from 'chai';
import { it } from 'mocha';
import app from '../../app';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;
const INVALID_ID = '1a1111aa111aa11aaaaaa1a1';

export const BaseIndependetTests = (path: string) => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('/getAll: should return status 200', () => {
    chai.request(app).get(`/api/${path}/getAll`)
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.an('array', 'of raw foods');
        res.body.forEach((element: any) => {
          expect(element).to.have.property('isDeleted', false);
        });
      });
  });

  it('/getAllDeleted: should return status 200', () => {
    chai.request(app).get(`/api/${path}/getAllDeleted`)
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.an('array', 'of raw foods');
        res.body.forEach((element: any) => {
          expect(element).to.have.property('isDeleted', true);
        });
      });
  });

  it('/get/:Id : invalid id should return status 400', () => {
    chai.request(app).get(`/api/${path}/get/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
      });
  });

  it('/delete/:Id : invalid id should return status 400', () => {
    chai.request(app).post(`/api/${path}/delete/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
      });
  });

  it('/restore/:Id : invalid id should return status 400', () => {
    chai.request(app).post(`/api/${path}/restore/${INVALID_ID}`)
      .then((res) => {
        expect(res).to.have.property('status', 400);
        expect(res.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
      });
  });
};

export const BaseSelfDependentTests = (path: string, createDTO: any) => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('/create , /get/:Id : successful get should return status 200', async () => {
    const createRes = await chai.request(app).post(`/api/${path}/create`)
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood = createRes.body;
    expect(rawFood).to.have.property('_id');
    expect(rawFood).to.include(createDTO);

    const getRes = await chai.request(app).get(`/api/${path}/get/${rawFood._id}`);
    expect(getRes).to.have.property('status', 200);
    const getRawFood = getRes.body;
    expect(getRawFood).to.have.property('_id', rawFood._id);
    expect(getRawFood).to.include(createDTO);
  });

  it('/create , /getAll : successful get should return status 200', async () => {
    const createRes = await chai.request(app).post(`/api/${path}/create`)
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood = createRes.body;
    expect(rawFood).to.have.property('_id');
    expect(rawFood).to.include(createDTO);

    const getRes = await chai.request(app).get(`/api/${path}/getAll`);
    expect(getRes).to.have.property('status', 200);
    expect(getRes.body).to.be.an('array');
    getRes.body.forEach((r: any) => {
      expect(r).to.have.property('_id');
      expect(r).to.have.property('isDeleted', false);
    });
  });

  it('/create , /delete, /getAllDeleted, /restore : successful delete, restore should return status 200', async () => {
    const createRes = await chai.request(app).post(`/api/${path}/create`)
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood = createRes.body;
    expect(rawFood).to.have.property('_id');
    expect(rawFood).to.include(createDTO);

    const deleteRes = await chai.request(app).post(`/api/${path}/delete/${rawFood._id}`);
    expect(deleteRes).to.have.property('status', 200);
    const deletedRawFood = deleteRes.body;
    expect(deletedRawFood).to.have.property('_id', rawFood._id);
    expect(deletedRawFood).to.have.property('isDeleted', true);
    expect(deletedRawFood).to.include(createDTO);

    const getAllDeletedRes = await chai.request(app).get(`/api/${path}/getAllDeleted`);
    expect(getAllDeletedRes).to.have.property('status', 200);
    expect(getAllDeletedRes.body).to.be.an('array');
    getAllDeletedRes.body.forEach((r: any) => {
      expect(r).to.have.property('_id');
      expect(r).to.have.property('isDeleted', true);
    });

    const restoredRes = await chai.request(app).post(`/api/${path}/restore/${rawFood._id}`);
    expect(restoredRes).to.have.property('status', 200);
    const restoredRawFood = restoredRes.body;
    expect(restoredRawFood).to.have.property('_id', rawFood._id);
    expect(restoredRawFood).to.have.property('isDeleted', false);
    expect(restoredRawFood).to.include(createDTO);
  });

  it('/create , /delete, /getAllDeleted, /restore : invalid delete, restore should return status 400', async () => {
    // Create first
    const createRes = await chai.request(app).post(`/api/${path}/create`)
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const rawFood = createRes.body;
    expect(rawFood).to.have.property('_id');
    expect(rawFood).to.include(createDTO);
    // Delete once
    const deleteRes = await chai.request(app).post(`/api/${path}/delete/${rawFood._id}`);
    expect(deleteRes).to.have.property('status', 200);
    const deletedRawFood = deleteRes.body;
    expect(deletedRawFood).to.have.property('_id', rawFood._id);
    expect(deletedRawFood).to.have.property('isDeleted', true);
    expect(deletedRawFood).to.include(createDTO);
    // Cannot delete twice
    const deleteRes2 = await chai.request(app).post(`/api/${path}/delete/${rawFood._id}`);
    expect(deleteRes2).to.have.property('status', 400);
    expect(deleteRes2.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
    // Cannot delete some invalid id
    const deleteRes3 = await chai.request(app).post(`/api/${path}/delete/${INVALID_ID}`);
    expect(deleteRes3).to.have.property('status', 400);
    expect(deleteRes3.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
    // Restore once
    const restoreRes = await chai.request(app).post(`/api/${path}/restore/${rawFood._id}`);
    expect(restoreRes).to.have.property('status', 200);
    const restoredRawFood = restoreRes.body;
    expect(restoredRawFood).to.have.property('_id', rawFood._id);
    expect(restoredRawFood).to.have.property('isDeleted', false);
    expect(restoredRawFood).to.include(createDTO);
    // Cannot restore twice
    const restoreRes2 = await chai.request(app).post(`/api/${path}/restore/${rawFood._id}`);
    expect(restoreRes2).to.have.property('status', 400);
    expect(restoreRes2.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
  });
};
