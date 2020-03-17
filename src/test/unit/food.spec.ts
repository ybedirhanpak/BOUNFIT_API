import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../../app';
import { FoodCreateDTO } from '../../interfaces/food';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('Food Unit Cases', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('Create without ingredients', async () => {
    const createDTO: FoodCreateDTO = {
      name: 'food 1',
    };
    const res = await chai.request(app).post('/api/foods/create')
      .send(createDTO);

    expect(res).to.have.property('status', 200);
    expect(res.body).to.have.property('name', 'food 1');
    expect(res.body).to.have.property('_id');
  });

  it('Create without name', () => {
    const createDTO = {
    };
    chai.request(app).post('/api/foods/create')
      .send(createDTO)
      .then((res) => {
        expect(res).to.have.property('status', 500);
        expect(res.body).to.have.property('name', errorNames.INTERNAL_ERROR);
      });
  });
});
