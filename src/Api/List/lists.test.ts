import 'jest';
import nock from 'nock';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {createList, getLists} from './lists';

const mockConfiguration: InternalConfig = {
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key',
};

let apiV3: ApiV3.API;

describe('lists', () => {
  beforeAll(() => {
    apiV3 = new ApiV3.API(mockConfiguration);
  });

  describe('createList', () => {
    it('sends a post to /lists', async () => {
      nock('https://api.zaius.com').post('/v3/lists', {name: 'Foo List'}).reply(200, '{}');
      await createList(apiV3, 'Foo List');
      expect(nock.isDone()).toBeTruthy();
    });
  });

  describe('getLists', () => {
    it('sends a get to /lists', async () => {
      nock('https://api.zaius.com').get('/v3/lists').reply(200, '{}');
      await getLists(apiV3);
      expect(nock.isDone()).toBeTruthy();
    });
  });
});
