import 'jest';
import * as nock from 'nock';
import {Headers} from 'node-fetch';
import {configure, InternalConfig} from '../config/configure';
import {RequestDetail} from '../config/RequestInterceptor';
import {ApiV3} from './ApiV3';

describe('post', () => {
  beforeAll(() => {
    configure(null);
  });

  it('performs a POST request', async () => {
    const payload = Object.freeze({foo: 'bar'});
    nock('https://api.zaius.com').post('/v3/foo/bar', {key: 'value'}).reply(200, payload);

    const result = await ApiV3.post('/foo/bar', {key: 'value'});

    expect(result).toEqual({
      success: true,
      status: 200,
      data: payload,
      statusText: 'OK',
      headers: new Headers({'content-type': 'application/json'})
    });
  });
});

describe('request', () => {
  beforeEach(() => {
    configure(null);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normalizes successful responses', async () => {
    nock('https://api.zaius.com').post('/v3/foo', {}).reply(200, '"bar"', {'request-id': '00000000'});

    const result = await ApiV3.request('POST', '/foo', {});
    expect(result).toEqual({
      success: true,
      status: 200,
      data: 'bar',
      statusText: 'OK',
      headers: new Headers({'request-id': '00000000'})
    });
  });

  it('normalizes error responses', async () => {
    nock('https://api.zaius.com').post('/v3/foo', {}).reply(400, '"bar"', {'request-id': '00000001'});

    const result = await ApiV3.request('POST', '/foo', {}, {retry: false}).catch((e) => e.response);
    expect(result).toEqual({
      success: false,
      data: 'bar',
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers({'request-id': '00000001'})
    });
  });

  describe('retries', () => {
    it('retries once when the response is a 502', async () => {
      nock('https://api.zaius.com').post('/v3/bar', {})
        .times(2).reply(502, '502');

      const requestFn = jest.spyOn(ApiV3, 'request');
      await ApiV3.request('POST', '/bar', {}).catch((e) => e.response);
      expect(requestFn).toHaveBeenCalledTimes(2);
    });

    it('does not retry when it receives a 4XX', async () => {
      nock('https://api.zaius.com').post('/v3/bar', {}).reply(400, '400');

      const requestFn = jest.spyOn(ApiV3, 'request');
      await ApiV3.request('POST', '/bar', {}).catch((e) => e.response);
      expect(requestFn).toHaveBeenCalledTimes(1);
    });

    it('can succeed after a retry', async () => {
      nock('https://api.zaius.com')
        .post('/v3/bar', {}).reply(502, '"NO"')
        .post('/v3/bar', {}).reply(200, '"OK"');

      const requestFn = jest.spyOn(ApiV3, 'request');
      const result = await ApiV3.request('POST', '/bar', {}).catch((e) => e.response);
      expect(requestFn).toHaveBeenCalledTimes(2);
      expect(result.status).toEqual(200);
      expect(result.data).toEqual('OK');
    });
  });

  it('allows requests to be manipuated by an interceptor', async () => {
    const updatedRequest: RequestDetail = Object.freeze({
      method: 'PUT' as ApiV3.HttpMethod,
      headers: {'x-foo': 'foo'},
      body: '"foo"'
    });
    configure({
      requestInterceptor: (url, info) => {
        expect(url).toBe('https://api.zaius.com/v3/bar');
        expect(info).toEqual({
          method: 'POST',
          body: JSON.stringify({foo: 'bar'}),
          headers: {'Content-Type': 'application/json', 'x-api-key': 'private.api_key'}
        });
        return ['https://foo.bar/v3/foo', updatedRequest];
      }
    } as Partial<InternalConfig> as InternalConfig);

    nock('https://foo.bar', {reqheaders: {'x-foo': 'foo'}}).put('/v3/foo', '"foo"').reply(200, '"bar"', {});

    const result = await ApiV3.request('POST', '/bar', {foo: 'bar'});
    expect(result).toEqual({
      success: true,
      status: 200,
      data: 'bar',
      statusText: 'OK',
      headers: new Headers()
    });
  });

  it('logs requests post interceptor when enabled', async () => {
    process.env.LOG_REQUESTS = 'true';
    const updatedRequest: RequestDetail = Object.freeze({
      method: 'PUT' as ApiV3.HttpMethod,
      headers: Object.freeze({'x-foo': 'foo'}),
      body: '"foo"'
    });
    configure({
      requestInterceptor: (url, info) => {
        expect(url).toBe('https://api.zaius.com/v3/bar');
        expect(info).toEqual({
          method: 'POST',
          body: JSON.stringify({foo: 'bar'}),
          headers: {'Content-Type': 'application/json', 'x-api-key': 'private.api_key'}
        });
        return ['https://foo.bar/v3/foo', updatedRequest];
      }
    } as Partial<InternalConfig> as InternalConfig);

    nock('https://foo.bar', {reqheaders: {'x-foo': 'foo'}}).put('/v3/foo', '"foo"').reply(200, '"bar"', {});

    const result = await ApiV3.request('POST', '/bar', {foo: 'bar'});
    expect(result).toEqual({
      success: true,
      status: 200,
      data: 'bar',
      statusText: 'OK',
      headers: new Headers()
    });

    expect(console.debug).toHaveBeenCalledWith(
      'API V3 Request: https://foo.bar/v3/foo',
      updatedRequest,
      '(200) body:',
      '"bar"'
    );
  });

  it('logs requests that fail when enabled', async () => {
    process.env.LOG_REQUESTS = 'true';
    const updatedRequest: RequestDetail = Object.freeze({
      method: 'PUT' as ApiV3.HttpMethod,
      headers: Object.freeze({'x-foo': 'foo'}),
      body: '"foo"'
    });
    configure({
      requestInterceptor: (url, info) => {
        expect(url).toBe('https://api.zaius.com/v3/bar');
        expect(info).toEqual({
          method: 'POST',
          body: JSON.stringify({foo: 'bar'}),
          headers: {'Content-Type': 'application/json', 'x-api-key': 'private.api_key'}
        });
        return ['https://foo.bar/v3/foo', updatedRequest];
      }
    } as Partial<InternalConfig> as InternalConfig);

    nock('https://foo.bar', {reqheaders: {'x-foo': 'foo'}}).put('/v3/foo', '"foo"')
      .reply(400, '{"errors": ["bar"]}', {});

    await ApiV3.request('POST', '/bar', {foo: 'bar'}).catch((e) => e.response);

    expect(console.debug).toHaveBeenCalledWith(
      'API V3 Request: https://foo.bar/v3/foo',
      updatedRequest,
      '(400) body:',
      '{"errors":["bar"]}'
    );
  });
});

describe('errorForCode', () => {
  it('returns an http error for a given error code', () => {
    const error = ApiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded);
    expect(error).toBeInstanceOf(ApiV3.HttpError);
    expect(error.code).toEqual(ApiV3.ErrorCode.BatchLimitExceeded);
    expect(error.message).toMatch(/maximum batch size/);
  });
});
