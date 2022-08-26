import 'jest';
import {ApiV3} from '../lib/ApiV3';
import {ObjectPayload} from '../Types';
import {object} from './object';
import deepFreeze = require('deep-freeze');

describe('object', () => {
  let postMock!: jest.Mock;
  beforeEach(() => {
    postMock = jest.spyOn(ApiV3, 'post').mockReturnValue(Promise.resolve({} as any));
  });

  it('sends a post to /objects/{type}', async () => {
    const payload = Object.freeze({product_id: 'P1234', name: 'Something Cool'});
    await object('products', {...payload});
    expect(postMock).toHaveBeenCalledWith('/objects/products', payload);
  });

  it('supports multiple updates', async () => {
    const payload = deepFreeze<ObjectPayload[]>([
      {product_id: 'P1234', name: 'Something Cool'},
      {product_id: 'P0000', name: 'Something not Cool'}
    ]);
    await object('products', [{...payload[0]}, {...payload[1]}]);
    expect(postMock).toHaveBeenCalledWith('/objects/products', payload);
  });

  it('sanitizes the payload', async () => {
    const expectedPayload = Object.freeze({product_id: 'P1234', name: 'Something Cool'});
    const payload = {...expectedPayload, ...{blank: ' ', nullValue: null}};
    await object('products', payload);
    expect(postMock).toHaveBeenCalledWith('/objects/products', expectedPayload);
  });

  it('applies PayloadOptions', async () => {
    const expectedPayload = Object.freeze({product_id: 'P1234', name: 'Something Cool', blank: ' '});
    const payload = {product_id: 'P1234', name: 'Something Cool', blank: ' ', nullValue: null};
    await object('products', payload, {trimToNull: false});
    expect(postMock).toHaveBeenCalledWith('/objects/products', expectedPayload);
  });

  it('throws an error if too many objects are sent in one call', async () => {
    const payload: ObjectPayload[] = [];
    for (let i = 0; i < ApiV3.BATCH_LIMIT + 1; i++) {
      payload.push({product_id: 'P1234', name: 'Something Cool'});
    }

    expect.assertions(2);
    try {
      await object('products', payload);
    } catch (error: any) {
      expect(error.message).toMatch(/maximum batch size/);
      expect(error.code).toEqual(ApiV3.ErrorCode.BatchLimitExceeded);
    }
  });
});
