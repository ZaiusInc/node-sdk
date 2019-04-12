import Axios, {AxiosError, AxiosResponse} from 'axios';
import 'jest';
import {ApiV3} from './ApiV3';
import {configure} from './configure';
import deepFreeze = require('deep-freeze');

jest.mock('axios');

const mockSuccess: AxiosResponse = deepFreeze({
  data: 'data',
  status: 200,
  statusText: 'OK',
  headers: {
    'request-id': '00000000-0000-0000-0000-000000000001'
  },
  config: {url: 'https://foo.bar/foo'},
  request: 'request'
});

const mockError: AxiosError = deepFreeze({
  name: 'HTTP Error',
  message: 'received bad request status',
  code: 'EIDK',
  response: undefined,
  config: {url: 'https://foo.bar/foo'},
  request: 'request'
});

describe('post', () => {
  beforeAll(() => {
    configure(null);
  });

  it('performs a POST request', async () => {
    const payload = Object.freeze({foo: 'bar'});
    (Axios.request as jest.Mock).mockReturnValue(Promise.resolve(mockSuccess));

    await ApiV3.post('/foo/bar', payload);

    expect(Axios.request).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.zaius.com/v3/foo/bar',
      headers: {
        'x-api-key': 'test_tracker_id',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(payload)
    });
  });
});

describe('request', () => {
  beforeAll(() => {
    configure(null);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes successful responses', async () => {
    (Axios.request as jest.Mock).mockReturnValue(Promise.resolve<AxiosResponse>({
      ...mockSuccess,
      data: 'bar'
    } as AxiosResponse));

    const result = await ApiV3.request('POST', '/foo', {});
    expect(result).toEqual({
      success: true,
      data: 'bar',
      status: 200,
      statusText: 'OK',
      headers: {
        'request-id': '00000000-0000-0000-0000-000000000001'
      }
    });
  });

  it('normalizes error responses', async () => {
    (Axios.request as jest.Mock).mockReturnValue(Promise.reject<AxiosError>({
      ...mockError,
      response: {
        success: false,
        data: 'bar',
        status: 400,
        statusText: 'Bad Request',
        headers: {
          'request-id': '00000000-0000-0000-0000-000000000002'
        },
        config: {url: 'https://foo.bar/foo'}
      }
    } as AxiosError));

    const result = await ApiV3.request('POST', '/foo', {retry: false}).catch((e) => e.response);
    expect(result).toEqual({
      success: false,
      data: 'bar',
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'request-id': '00000000-0000-0000-0000-000000000002'
      }
    });
  });

  describe('retries', () => {
    it('retries once when the response is a 502', async () => {
      (Axios.request as jest.Mock).mockReturnValue(Promise.reject<AxiosError>({
        ...mockError,
        code: 'EIDK',
        response: {
          success: false,
          data: null,
          status: 502,
          statusText: 'Bad Gateway',
          headers: {
            'request-id': '00000000-0000-0000-0000-000000000002'
          },
          config: {url: 'https://foo.bar/foo'}
        }
      } as AxiosError));

      await ApiV3.request('POST', '/foo', {retry: false}).catch((e) => e.response);

      expect(Axios.request).toHaveBeenCalledTimes(2);
    });

    it('retries once when a response was not received', async () => {
      (Axios.request as jest.Mock).mockReturnValue(Promise.reject<AxiosError>({
        ...mockError,
        code: 'ETIMEDOUT',
      } as AxiosError));

      await ApiV3.request('POST', '/foo', {retry: false}).catch((e) => e.response);

      expect(Axios.request).toHaveBeenCalledTimes(2);
    });

    it('does not retry when it receives a 4XX', async () => {
      (Axios.request as jest.Mock).mockReturnValue(Promise.reject<AxiosError>({
        ...mockError,
        code: 'EIDK',
        response: {
          success: false,
          data: null,
          status: 400,
          statusText: 'Bad Request',
          headers: {
            'request-id': '00000000-0000-0000-0000-000000000002'
          },
          config: {url: 'https://foo.bar/foo'}
        }
      } as AxiosError));

      await ApiV3.request('POST', '/foo', {retry: false}).catch((e) => e.response);

      expect(Axios.request).toHaveBeenCalledTimes(1);
    });

    it('can succeed after a retry', async () => {
      let time = 1;
      (Axios.request as jest.Mock).mockImplementation(() => {
        if (time === 1) {
          time = 2;
          return Promise.reject<AxiosError>({
            ...mockError,
            code: 'ETIMEDOUT',
          } as AxiosError);
        }
        return Promise.resolve<AxiosResponse>(mockSuccess as AxiosResponse);
      });

      const result = await ApiV3.request('POST', '/foo', {retry: false}).catch((e) => e.response);

      expect(Axios.request).toHaveBeenCalledTimes(2);

      expect(result).toEqual({
        success: true,
        data: 'data',
        status: 200,
        statusText: 'OK',
        headers: {
          'request-id': '00000000-0000-0000-0000-000000000001'
        }
      });
    });
  });
});

describe('errorForCode', () => {
  it('returns an http error for a given error code', () => {
    expect(ApiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded)).toEqual({
      name: ApiV3.ErrorCode.BatchLimitExceeded,
      message: expect.stringMatching(/maximum of 500/),
      code: ApiV3.ErrorCode.BatchLimitExceeded,
    });
  });
});
