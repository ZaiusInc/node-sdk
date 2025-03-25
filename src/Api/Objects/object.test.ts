import 'jest';
import {ApiV3} from '../lib/ApiV3';
import {ObjectPayload} from '../Types';
import {object} from './object';
import deepFreeze from 'deep-freeze';
import {InternalConfig} from '../config/configure';

const mockAppConfiguration: InternalConfig = {
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key',
  appContext: {
    app_id: 'test',
    display_name: 'Test App',
    version: '1.0.0',
    vendor: 'optimizely',
  },
};

describe('object', () => {
  let postMock!: jest.SpyInstance;
  const apiV3 = new ApiV3.API(mockAppConfiguration);
  beforeEach(() => {
    postMock = jest.spyOn(apiV3, 'post').mockReturnValue(Promise.resolve({} as any));
  });

  it('sends a post to /objects/{type}', async () => {
    const payload = Object.freeze({product_id: 'P1234', name: 'Something Cool'});
    await object(apiV3, 'products', {...payload});
    expect(postMock).toHaveBeenCalledWith('/objects/products', payload);
  });

  it('supports multiple updates', async () => {
    const payload = deepFreeze<ObjectPayload[]>([
      {product_id: 'P1234', name: 'Something Cool'},
      {product_id: 'P0000', name: 'Something not Cool'},
    ]);
    await object(apiV3, 'products', [{...payload[0]}, {...payload[1]}]);
    expect(postMock).toHaveBeenCalledWith('/objects/products', payload);
  });

  it('sanitizes the payload', async () => {
    const expectedPayload = Object.freeze({product_id: 'P1234', name: 'Something Cool'});
    const payload = {...expectedPayload, ...{blank: ' ', nullValue: null}};
    await object(apiV3, 'products', payload);
    expect(postMock).toHaveBeenCalledWith('/objects/products', expectedPayload);
  });

  it('applies PayloadOptions', async () => {
    const expectedPayload = Object.freeze({product_id: 'P1234', name: 'Something Cool', blank: ' '});
    const payload = {product_id: 'P1234', name: 'Something Cool', blank: ' ', nullValue: null};
    await object(apiV3, 'products', payload, {trimToNull: false});
    expect(postMock).toHaveBeenCalledWith('/objects/products', expectedPayload);
  });

  it('throws an error if too many objects are sent in one call', async () => {
    const payload: ObjectPayload[] = [];
    for (let i = 0; i < ApiV3.BATCH_LIMIT + 1; i++) {
      payload.push({product_id: 'P1234', name: 'Something Cool'});
    }

    expect.assertions(2);
    try {
      await object(apiV3, 'products', payload);
    } catch (error: any) {
      expect(error.message).toMatch(/maximum batch size/);
      expect(error.code).toEqual(ApiV3.ErrorCode.BatchLimitExceeded);
    }
  });
});
