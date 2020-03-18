import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../../app';
import {
  RestaurantCreateDTO,
} from '../../interfaces/restaurant';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';
import { BaseApiIndependentTests, BaseApiSelfDependentTests } from '../helpers/baseTests';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;
const INVALID_ID = '1a1111aa111aa11aaaaaa1a1';

describe('Restaurant Base Api Independent Tests', () => {
  BaseApiIndependentTests('restaurants');
});

describe('Restaurant Base Api Self Dependent Tests', () => {
  const createDTO: RestaurantCreateDTO = {
    name: 'restaurant 1',
  };

  BaseApiSelfDependentTests('restaurants', createDTO);
});
