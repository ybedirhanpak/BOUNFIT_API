import chai from 'chai';
import { it } from 'mocha';
import app from '../../app';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;
const INVALID_ID = '1a1111aa111aa11aaaaaa1a1';

export const BaseApiIndependentTests = (path: string) => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('/getAll: should return status 200', () => {
    chai.request(app).get(`/api/${path}/getAll`)
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.an('array', 'of instances');
        res.body.forEach((element: any) => {
          expect(element).to.have.property('isDeleted', false);
        });
      });
  });

  it('/getAllDeleted: should return status 200', () => {
    chai.request(app).get(`/api/${path}/getAllDeleted`)
      .then((res) => {
        expect(res).to.have.property('status', 200);
        expect(res.body).to.be.an('array', 'of instances');
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

export const BaseApiSelfDependentTests = (path: string, createDTO: any) => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('/create , /get/:Id : successful get should return status 200', async () => {
    const createRes = await chai.request(app).post(`/api/${path}/create`)
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const instance = createRes.body;
    expect(instance).to.have.property('_id');
    expect(instance).to.include(createDTO);

    const getRes = await chai.request(app).get(`/api/${path}/get/${instance._id}`);
    expect(getRes).to.have.property('status', 200);
    const getInstance = getRes.body;
    expect(getInstance).to.have.property('_id', instance._id);
    expect(getInstance).to.include(createDTO);
  });

  it('/create , /getAll : successful get should return status 200', async () => {
    const createRes = await chai.request(app).post(`/api/${path}/create`)
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const instance = createRes.body;
    expect(instance).to.have.property('_id');
    expect(instance).to.include(createDTO);

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
    const instance = createRes.body;
    expect(instance).to.have.property('_id');
    expect(instance).to.include(createDTO);

    const deleteRes = await chai.request(app).post(`/api/${path}/delete/${instance._id}`);
    expect(deleteRes).to.have.property('status', 200);
    const deletedInstance = deleteRes.body;
    expect(deletedInstance).to.have.property('_id', instance._id);
    expect(deletedInstance).to.have.property('isDeleted', true);
    expect(deletedInstance).to.include(createDTO);

    const getAllDeletedRes = await chai.request(app).get(`/api/${path}/getAllDeleted`);
    expect(getAllDeletedRes).to.have.property('status', 200);
    expect(getAllDeletedRes.body).to.be.an('array');
    getAllDeletedRes.body.forEach((r: any) => {
      expect(r).to.have.property('_id');
      expect(r).to.have.property('isDeleted', true);
    });

    const restoredRes = await chai.request(app).post(`/api/${path}/restore/${instance._id}`);
    expect(restoredRes).to.have.property('status', 200);
    const restoredInstance = restoredRes.body;
    expect(restoredInstance).to.have.property('_id', instance._id);
    expect(restoredInstance).to.have.property('isDeleted', false);
    expect(restoredInstance).to.include(createDTO);
  });

  it('/create , /delete, /getAllDeleted, /restore : invalid delete, restore should return status 400', async () => {
    // Create first
    const createRes = await chai.request(app).post(`/api/${path}/create`)
      .send(createDTO);
    expect(createRes).to.have.property('status', 200);
    const instance = createRes.body;
    expect(instance).to.have.property('_id');
    expect(instance).to.include(createDTO);
    // Delete once
    const deleteRes = await chai.request(app).post(`/api/${path}/delete/${instance._id}`);
    expect(deleteRes).to.have.property('status', 200);
    const deletedInstance = deleteRes.body;
    expect(deletedInstance).to.have.property('_id', instance._id);
    expect(deletedInstance).to.have.property('isDeleted', true);
    expect(deletedInstance).to.include(createDTO);
    // Cannot delete twice
    const deleteRes2 = await chai.request(app).post(`/api/${path}/delete/${instance._id}`);
    expect(deleteRes2).to.have.property('status', 400);
    expect(deleteRes2.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
    // Cannot delete some invalid id
    const deleteRes3 = await chai.request(app).post(`/api/${path}/delete/${INVALID_ID}`);
    expect(deleteRes3).to.have.property('status', 400);
    expect(deleteRes3.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
    // Restore once
    const restoreRes = await chai.request(app).post(`/api/${path}/restore/${instance._id}`);
    expect(restoreRes).to.have.property('status', 200);
    const restoredInstance = restoreRes.body;
    expect(restoredInstance).to.have.property('_id', instance._id);
    expect(restoredInstance).to.have.property('isDeleted', false);
    expect(restoredInstance).to.include(createDTO);
    // Cannot restore twice
    const restoreRes2 = await chai.request(app).post(`/api/${path}/restore/${instance._id}`);
    expect(restoreRes2).to.have.property('status', 400);
    expect(restoreRes2.body).to.have.property('name', errorNames.INSTANCE_NOT_FOUND);
  });
};
