import chai from 'chai';
import { describe, it } from 'mocha';
import app from '../../app';
import {
  GroceryStoreCreateDTO,
} from '../../interfaces/groceryStore';
import { connectDatabase } from '../../database/index';
import { errorNames } from '../../helpers/errors';
import { BaseApiIndependentTests, BaseApiSelfDependentTests } from '../helpers/baseTests';

import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;
const INVALID_ID = '1a1111aa111aa11aaaaaa1a1';

describe('GroceryStore Base Api Independent Tests', () => {
  BaseApiIndependentTests('groceryStores');
});

describe('GroceryStore Base Api Self Dependent Tests', () => {
  const createDTO: GroceryStoreCreateDTO = {
    name: 'groceryStore 1',
  };

  BaseApiSelfDependentTests('groceryStores', createDTO);
});
