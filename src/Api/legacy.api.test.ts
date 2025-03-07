import 'jest';
import nock from 'nock';
import {Headers} from 'node-fetch';
import {odp} from './index';
import {InternalConfig} from './config/configure';

const mockConfiguration: InternalConfig = {
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key',
};

describe('module scoped configuration', () => {
  it('configured ', async () => {
    odp.configure(mockConfiguration);
    nock('https://api.zaius.com')
      .post('/v3/foo', {})
      .matchHeader('x-api-key', 'api-key')
      .reply(200, {result: 'old-api-key'})
      .post('/v3/bar', {})
      .matchHeader('x-api-key', 'new-api-key')
      .reply(200, {result: 'new-api-key'});

    const result = await odp.v3Api.post('/foo', {});
    expect(result).toEqual({
      success: true,
      status: 200,
      data: {result: 'old-api-key'},
      statusText: 'OK',
      headers: new Headers({'content-type': 'application/json'}),
    });

    odp.configure({
      apiBasePath: 'https://api.zaius.com/v3/',
      apiKey: 'new-api-key',
    });

    const reconfiguredResult = await odp.v3Api.post('/bar', {});
    expect(reconfiguredResult).toEqual({
      success: true,
      status: 200,
      data: {result: 'new-api-key'},
      statusText: 'OK',
      headers: new Headers({'content-type': 'application/json'}),
    });
  });
});
