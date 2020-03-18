import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../../app';
import {
  MealCreateDTO,
} from '../../interfaces/meal';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';
import { BaseApiIndependentTests, BaseApiSelfDependentTests } from '../helpers/baseTests';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;
const INVALID_ID = '1a1111aa111aa11aaaaaa1a1';

describe('Meal Base Api Independent Tests', () => {
  BaseApiIndependentTests('meals');
});

describe('Meal Base Api Self Dependent Tests', () => {
  const createDTO: MealCreateDTO = {
    name: 'meal 1',
  };

  BaseApiSelfDependentTests('meals', createDTO);
});
