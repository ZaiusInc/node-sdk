import {ApiV3} from '../lib/ApiV3';
import {Customer} from '../Types';
import {customer} from './customer';

describe('customer', () => {
  let postMock!: jest.Mock;
  beforeEach(() => {
    postMock = jest.spyOn(ApiV3, 'post').mockReturnValue(Promise.resolve({} as any));
  });

  it('sends a transformed post with one customer to /profiles', async () => {
    const payload: Customer = {identifiers: {email: 'test@zaius.com'}, attributes: {name: 'Jim Bob'}};
    const transformedPayload = {attributes: {name: 'Jim Bob', email: 'test@zaius.com'}};
    await customer(payload);
    expect(postMock).toHaveBeenCalledWith('/profiles', transformedPayload);
  });

  it('sends a transformed post with several customers to /profiles', async () => {
    const payload: Customer[] = [
      {identifiers: {email: 'test1@zaius.com'}, attributes: {name: 'Jim Bob'}},
      {identifiers: {email: 'test2@zaius.com'}, attributes: {name: 'Bob Joe'}},
      {identifiers: {email: 'test3@zaius.com'}, attributes: {name: 'Joe Jim'}}
    ];
    const transformedPayload = [
      {attributes: {name: 'Jim Bob', email: 'test1@zaius.com'}},
      {attributes: {name: 'Bob Joe', email: 'test2@zaius.com'}},
      {attributes: {name: 'Joe Jim', email: 'test3@zaius.com'}}
    ];
    await customer(payload);
    expect(postMock).toHaveBeenCalledWith('/profiles', transformedPayload);
  });

  it('throws an error if too many customers are sent in one call', async () => {
    const payload: Customer[] = [];
    for (let i = 0; i < ApiV3.BATCH_LIMIT + 1; i++) {
      payload.push({identifiers: {email: 'test@zaius.com'}, attributes: {name: 'Jim Bob'}});
    }

    expect.assertions(2);
    try {
      await customer(payload);
    } catch (error) {
      expect(error.message).toMatch(/maximum batch size/);
      expect(error.code).toEqual(ApiV3.ErrorCode.BatchLimitExceeded);
    }
  });
});
