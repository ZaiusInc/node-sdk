import 'jest';
import nock from 'nock';
import {Headers} from 'node-fetch';
import {configOrDefault, InternalConfig} from '../config/configure';
import {RequestDetail} from '../config/RequestInterceptor';
import {ApiV3} from './ApiV3';

const mockConfiguration: InternalConfig = {
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key',
};

let apiV3: ApiV3.API;

describe('post', () => {
  beforeAll(() => {
    apiV3 = new ApiV3.API(mockConfiguration);
  });

  it('performs a POST request', async () => {
    const payload = Object.freeze({foo: 'bar'});
    nock('https://api.zaius.com').post('/v3/foo/bar', {key: 'value'}).reply(200, payload);

    const result = await apiV3.post('/foo/bar', {key: 'value'});

    expect(result).toEqual({
      success: true,
      status: 200,
      data: payload,
      statusText: 'OK',
      headers: new Headers({'content-type': 'application/json'}),
    });
  });
});

describe('request', () => {
  beforeEach(() => {
    apiV3 = new ApiV3.API(mockConfiguration);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes successful responses', async () => {
    nock('https://api.zaius.com').post('/v3/foo', {}).reply(200, '"bar"', {'request-id': '00000000'});

    const result = await apiV3.request('POST', '/foo', {});
    expect(result).toEqual({
      success: true,
      status: 200,
      data: 'bar',
      statusText: 'OK',
      headers: new Headers({'request-id': '00000000'}),
    });
  });

  it('normalizes error responses', async () => {
    nock('https://api.zaius.com').post('/v3/foo', {}).reply(400, 'bar', {'request-id': '00000001'});

    const result = await apiV3.request('POST', '/foo', {}, {retry: false}).catch((e) => e.response);
    expect(result).toEqual({
      success: false,
      data: {error: 'bar'},
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers({'request-id': '00000001'}),
    });
  });

  describe('retries', () => {
    it('retries once when the response is a 502 and handle a JSON response', async () => {
      nock('https://api.zaius.com')
        .post('/v3/bar', {})
        .times(2)
        .reply(502, '{"error": "JSON failure"}', {'content-type': 'application/json'});

      const requestFn = jest.spyOn(apiV3, 'request');
      const response = await apiV3.request('POST', '/bar', {}).catch((e) => e.response);
      expect(response.data).toEqual({error: 'JSON failure'});
      expect(requestFn).toHaveBeenCalledTimes(2);
    });

    it('retries once when the response is a 502 and handle a non-JSON response', async () => {
      nock('https://api.zaius.com').post('/v3/bar', {}).times(2).reply(502, 'non JSON failure');

      const requestFn = jest.spyOn(apiV3, 'request');
      const response = await apiV3.request('POST', '/bar', {}).catch((e) => e.response);
      expect(response.data).toEqual({error: 'non JSON failure'});
      expect(requestFn).toHaveBeenCalledTimes(2);
    });

    it('does not retry when it receives a 4XX', async () => {
      nock('https://api.zaius.com').post('/v3/bar', {}).reply(400, '400');

      const requestFn = jest.spyOn(apiV3, 'request');
      await apiV3.request('POST', '/bar', {}).catch((e) => e.response);
      expect(requestFn).toHaveBeenCalledTimes(1);
    });

    it('can succeed after a retry', async () => {
      nock('https://api.zaius.com').post('/v3/bar', {}).reply(502, '"NO"').post('/v3/bar', {}).reply(200, '"OK"');

      const requestFn = jest.spyOn(apiV3, 'request');
      const result = await apiV3.request('POST', '/bar', {}).catch((e) => e.response);
      expect(requestFn).toHaveBeenCalledTimes(2);
      expect(result.status).toEqual(200);
      expect(result.data).toEqual('OK');
    });
  });

  it('allows requests to be manipulated by an interceptor', async () => {
    const updatedRequest: RequestDetail = Object.freeze({
      method: 'PUT' as ApiV3.HttpMethod,
      headers: {'x-foo': 'foo'},
      body: '"foo"',
    });
    apiV3 = new ApiV3.API(
      configOrDefault({
        apiKey: 'private.api_key',
        requestInterceptor: (url, info) => {
          expect(url).toBe('https://api.zaius.com/v3/bar');
          expect(info).toEqual({
            method: 'POST',
            body: JSON.stringify({foo: 'bar'}),
            headers: {'Content-Type': 'application/json', 'x-api-key': 'private.api_key'},
          });
          return ['https://foo.bar/v3/foo', updatedRequest];
        },
      }),
    );

    nock('https://foo.bar', {reqheaders: {'x-foo': 'foo'}})
      .put('/v3/foo', '"foo"')
      .reply(200, '"bar"', {});

    const result = await apiV3.request('POST', '/bar', {foo: 'bar'});
    expect(result).toEqual({
      success: true,
      status: 200,
      data: 'bar',
      statusText: 'OK',
      headers: new Headers(),
    });
  });

  it('logs requests post interceptor when enabled', async () => {
    process.env.LOG_REQUESTS = 'true';
    const updatedRequest: RequestDetail = Object.freeze({
      method: 'PUT' as ApiV3.HttpMethod,
      headers: Object.freeze({'x-foo': 'foo'}),
      body: '"foo"',
    });
    apiV3 = new ApiV3.API(
      configOrDefault({
        apiKey: 'private.api_key',
        requestInterceptor: (url, info) => {
          expect(url).toBe('https://api.zaius.com/v3/bar');
          expect(info).toEqual({
            method: 'POST',
            body: JSON.stringify({foo: 'bar'}),
            headers: {'Content-Type': 'application/json', 'x-api-key': 'private.api_key'},
          });
          return ['https://foo.bar/v3/foo', updatedRequest];
        },
      }),
    );

    nock('https://foo.bar', {reqheaders: {'x-foo': 'foo'}})
      .put('/v3/foo', '"foo"')
      .reply(200, '"bar"', {});

    const result = await apiV3.request('POST', '/bar', {foo: 'bar'});
    expect(result).toEqual({
      success: true,
      status: 200,
      data: 'bar',
      statusText: 'OK',
      headers: new Headers(),
    });

    expect(console.debug).toHaveBeenCalledWith(
      'API V3 Request: https://foo.bar/v3/foo',
      updatedRequest,
      '(200) body:',
      '"bar"',
    );
  });

  it('logs requests that fail when enabled', async () => {
    process.env.LOG_REQUESTS = 'true';
    const updatedRequest: RequestDetail = Object.freeze({
      method: 'PUT' as ApiV3.HttpMethod,
      headers: Object.freeze({'x-foo': 'foo'}),
      body: '"foo"',
    });
    apiV3 = new ApiV3.API(
      configOrDefault({
        apiKey: 'private.api_key',
        requestInterceptor: (url, info) => {
          expect(url).toBe('https://api.zaius.com/v3/bar');
          expect(info).toEqual({
            method: 'POST',
            body: JSON.stringify({foo: 'bar'}),
            headers: {'Content-Type': 'application/json', 'x-api-key': 'private.api_key'},
          });
          return ['https://foo.bar/v3/foo', updatedRequest];
        },
      }),
    );

    nock('https://foo.bar', {reqheaders: {'x-foo': 'foo'}})
      .put('/v3/foo', '"foo"')
      .reply(400, '{"errors": ["bar"]}', {'content-type': 'application/json'});

    await apiV3.request('POST', '/bar', {foo: 'bar'}).catch((e) => e.response);

    expect(console.debug).toHaveBeenCalledWith(
      'API V3 Request: https://foo.bar/v3/foo',
      updatedRequest,
      '(400) body:',
      '{"errors":["bar"]}',
    );
  });

  it('throws HTTP Exception for unknown error', async () => {
    process.env.LOG_REQUESTS = 'true';
    const updatedRequest: RequestDetail = Object.freeze({
      method: 'PUT' as ApiV3.HttpMethod,
      headers: Object.freeze({'x-foo': 'foo'}),
      body: '"foo"',
    });
    apiV3 = new ApiV3.API(
      configOrDefault({
        apiKey: 'private.api_key',
        requestInterceptor: (url, info) => {
          expect(url).toBe('https://api.zaius.com/v3/bar');
          expect(info).toEqual({
            method: 'POST',
            body: JSON.stringify({foo: 'bar'}),
            headers: {'Content-Type': 'application/json', 'x-api-key': 'private.api_key'},
          });
          return ['https://foo.bar/v3/foo', updatedRequest];
        },
      }),
    );

    nock('https://foo.bar', {reqheaders: {'x-foo': 'foo'}})
      .put('/v3/foo', '"foo"')
      .replyWithError('unknown error');

    await expect(apiV3.request('POST', '/bar', {foo: 'bar'})).rejects.toThrowError(
      new ApiV3.HttpError('request to https://foo.bar/v3/foo failed, reason: unknown error'),
    );
  });
});

describe('errorForCode', () => {
  it('returns an http error for a given error code', () => {
    apiV3 = new ApiV3.API(mockConfiguration);
    const error = apiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded);
    expect(error).toBeInstanceOf(ApiV3.HttpError);
    expect(error.code).toEqual(ApiV3.ErrorCode.BatchLimitExceeded);
    expect(error.message).toMatch(/maximum batch size/);
  });
});
