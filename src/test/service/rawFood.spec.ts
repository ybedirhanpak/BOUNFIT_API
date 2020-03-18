import chai from 'chai';
import { describe, it } from 'mocha';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';
import RawFoodService from '../../services/rawFood';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;
const INVALID_ID = '1a1111aa111aa11aaaaaa1a1';

describe('RawFood Service Independent Tests', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it(`Create: invalid createDTO should throw ${errorNames.INVALID_RAW_FOOD}`, async () => {
    const createDTO = {
      name: 'sample raw food',
      protein: 10,
      carb: 10,
      fat: 10,
      calories: 10,
    };

    RawFoodService.Create({ }as any).catch((err) => {
      expect(err).to.have.property('name', errorNames.VALIDATION_ERROR);
    });

    RawFoodService.Create({ ...createDTO, name: undefined } as any).catch((err) => {
      expect(err).to.have.property('name', errorNames.VALIDATION_ERROR);
    });

    RawFoodService.Create({ ...createDTO, protein: -10 }).catch((err) => {
      expect(err).to.have.property('name', errorNames.INVALID_RAW_FOOD);
    });

    RawFoodService.Create({ ...createDTO, carb: -10 }).catch((err) => {
      expect(err).to.have.property('name', errorNames.INVALID_RAW_FOOD);
    });

    RawFoodService.Create({ ...createDTO, fat: -10 }).catch((err) => {
      expect(err).to.have.property('name', errorNames.INVALID_RAW_FOOD);
    });

    RawFoodService.Create({ ...createDTO, calories: -10 }).catch((err) => {
      expect(err).to.have.property('name', errorNames.INVALID_RAW_FOOD);
    });
  });

  it(`Update: invalid Id should throw ${errorNames.RAW_FOOD_NOT_FOUND}`, () => {
    const updateDTO = {
      name: 'sample raw food',
      protein: 10,
      carb: 10,
      fat: 10,
      calories: 10,
    };
    RawFoodService.UpdateById(INVALID_ID, updateDTO).catch((err) => {
      expect(err).to.have.property('name', errorNames.RAW_FOOD_NOT_FOUND);
    });
  });
});

describe('RawFood Service Self Dependent Tests', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    await connectDatabase();
  });

  it('Update: successful Create & Update', async () => {
    const rawFoodDTO = {
      name: 'sample raw food',
      protein: 18,
      carb: 17,
      fat: 10,
      calories: 10,
    };

    const rawFood = await RawFoodService.Create(rawFoodDTO);
    expect(rawFood).to.include(rawFoodDTO);

    const updateDTO = {
      name: 'updated raw food',
      protein: 21,
      carb: 22,
      fat: 23,
      calories: 100,
    };

    RawFoodService.UpdateById(`${rawFood._id}`, updateDTO).then((updatedRawFood) => {
      expect(updatedRawFood).to.include(updateDTO);
    });
  });

  it(`Update: invalid updateDTO should throw ${errorNames.INVALID_RAW_FOOD}`, async () => {
    const rawFoodDTO = {
      name: 'sample raw food',
      protein: 18,
      carb: 17,
      fat: 10,
      calories: 10,
    };

    const rawFood = await RawFoodService.Create(rawFoodDTO);

    RawFoodService.UpdateById(`${rawFood._id}`, { ...rawFoodDTO, name: undefined } as any).catch((err) => {
      expect(err).to.have.property('name', errorNames.VALIDATION_ERROR);
    });

    RawFoodService.UpdateById(`${rawFood._id}`, { ...rawFoodDTO, protein: -10 } as any).catch((err) => {
      expect(err).to.have.property('name', errorNames.INVALID_RAW_FOOD);
    });

    RawFoodService.UpdateById(`${rawFood._id}`, { ...rawFoodDTO, carb: -10 } as any).catch((err) => {
      expect(err).to.have.property('name', errorNames.INVALID_RAW_FOOD);
    });

    RawFoodService.UpdateById(`${rawFood._id}`, { ...rawFoodDTO, fat: -10 } as any).catch((err) => {
      expect(err).to.have.property('name', errorNames.INVALID_RAW_FOOD);
    });

    RawFoodService.UpdateById(`${rawFood._id}`, { ...rawFoodDTO, calories: -10 } as any).catch((err) => {
      expect(err).to.have.property('name', errorNames.INVALID_RAW_FOOD);
    });
  });
});
