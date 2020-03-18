import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../../app';
import {
  DailyPlanCreateDTO,
} from '../../interfaces/dailyPlan';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';
import { BaseApiIndependentTests, BaseApiSelfDependentTests } from '../helpers/baseTests';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;
const INVALID_ID = '1a1111aa111aa11aaaaaa1a1';

describe('DailyPlan Base Api Independent Tests', () => {
  BaseApiIndependentTests('dailyPlans');
});

describe('DailyPlan Base Api Self Dependent Tests', () => {
  const createDTO: DailyPlanCreateDTO = {
    name: 'dailyPlan 1',
  };

  BaseApiSelfDependentTests('dailyPlans', createDTO);
});
