import * as deepFreeze from 'deep-freeze';
import 'jest';
import {ApiV3} from '../lib/ApiV3';
import {ZaiusObject} from '../Types';
import {object} from './object';

describe('object', () => {
  let postMock!: jest.Mock;
  beforeEach(() => {
    postMock = jest.spyOn(ApiV3, 'post').mockReturnValue(Promise.resolve({} as any));
  });

  it('sends a post to /objects/{type}', async () => {
    const payload = deepFreeze({product_id: 'P1234', name: 'Something Cool'});
    await object('products', payload);
    expect(postMock).toHaveBeenCalledWith('/objects/products', payload);
  });

  it('throws an error if too many objects are sent in one call', async () => {
    const payload: ZaiusObject[] = [];
    for (let i = 0; i < ApiV3.BATCH_LIMIT + 1; i++) {
      payload.push({product_id: 'P1234', name: 'Something Cool'});
    }

    expect.assertions(2);
    try {
      await object('products', payload);
    } catch (error) {
      expect(error.message).toMatch(/maximum batch size/);
      expect(error.code).toEqual(ApiV3.ErrorCode.BatchLimitExceeded);
    }
  });
});
