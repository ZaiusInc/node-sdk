import {ApiV3} from '../lib/ApiV3';
import {CustomerPayload} from '../Types';
import {customer} from './customer';

describe('customer', () => {
  let postMock!: jest.Mock;
  beforeEach(() => {
    postMock = jest.spyOn(ApiV3, 'post').mockReturnValue(Promise.resolve({} as any));
  });

  it('sends a transformed post with one customer to /profiles', async () => {
    const payload: CustomerPayload = {identifiers: {email: 'test@zaius.com'}, attributes: {name: 'Jim Bob'}};
    const transformedPayload = {attributes: {name: 'Jim Bob', email: 'test@zaius.com'}};
    await customer(payload);
    expect(postMock).toHaveBeenCalledWith('/profiles', transformedPayload);
  });

  it('sends a transformed post with several customers to /profiles', async () => {
    const payload: CustomerPayload[] = [
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

  it('sanitizes the payload', async () => {
    const payload: CustomerPayload = {
      identifiers: {
        email: 'test@zaius.com'
      },
      attributes: {
        name: 'Jim Bob',
        blank: ' ',
        nullValue: null
      }
    };
    const transformedPayload = {attributes: {name: 'Jim Bob', email: 'test@zaius.com'}};
    await customer(payload);
    expect(postMock).toHaveBeenCalledWith('/profiles', transformedPayload);
  });

  it('sanitizes the payload with several customers', async () => {
    const payload: CustomerPayload[] = [
      {identifiers: {email: 'test1@zaius.com'}, attributes: {name: 'Jim Bob', blank: ' ', nullValue: null}},
      {identifiers: {email: 'test2@zaius.com'}, attributes: {name: 'Bob Joe', blank: ' ', nullValue: null}},
      {identifiers: {email: 'test3@zaius.com'}, attributes: {name: 'Joe Jim', blank: ' ', nullValue: null}}
    ];
    const transformedPayload = [
      {attributes: {name: 'Jim Bob', email: 'test1@zaius.com'}},
      {attributes: {name: 'Bob Joe', email: 'test2@zaius.com'}},
      {attributes: {name: 'Joe Jim', email: 'test3@zaius.com'}}
    ];
    await customer(payload);
    expect(postMock).toHaveBeenCalledWith('/profiles', transformedPayload);
  });

  it('applies PayloadOptions', async () => {
    const payload: CustomerPayload = {
      identifiers: {
        email: 'test@zaius.com'
      },
      attributes: {
        name: 'Jim Bob',
        blank: ' ',
        nullValue: null
      }
    };
    const transformedPayload = {attributes: {name: 'Jim Bob', email: 'test@zaius.com', blank: null, nullValue: null}};
    await customer(payload, {excludeNulls: false});
    expect(postMock).toHaveBeenCalledWith('/profiles', transformedPayload);
  });

  it('applies PayloadOptions with several customers', async () => {
    const payload: CustomerPayload[] = [
      {identifiers: {email: 'test1@zaius.com'}, attributes: {name: 'Jim Bob', blank: ' ', nullValue: null}},
      {identifiers: {email: 'test2@zaius.com'}, attributes: {name: 'Bob Joe', blank: ' ', nullValue: null}},
      {identifiers: {email: 'test3@zaius.com'}, attributes: {name: 'Joe Jim', blank: ' ', nullValue: null}}
    ];
    const transformedPayload = [
      {attributes: {name: 'Jim Bob', email: 'test1@zaius.com', blank: ' '}},
      {attributes: {name: 'Bob Joe', email: 'test2@zaius.com', blank: ' '}},
      {attributes: {name: 'Joe Jim', email: 'test3@zaius.com', blank: ' '}}
    ];
    await customer(payload, {trimToNull: false});
    expect(postMock).toHaveBeenCalledWith('/profiles', transformedPayload);
  });

  it('throws an error if too many customers are sent in one call', async () => {
    const payload: CustomerPayload[] = [];
    for (let i = 0; i < ApiV3.BATCH_LIMIT + 1; i++) {
      payload.push({identifiers: {email: 'test@zaius.com'}, attributes: {name: 'Jim Bob'}});
    }

    expect.assertions(2);
    try {
      await customer(payload);
    } catch (error: any) {
      expect(error.message).toMatch(/maximum batch size/);
      expect(error.code).toEqual(ApiV3.ErrorCode.BatchLimitExceeded);
    }
  });
});
