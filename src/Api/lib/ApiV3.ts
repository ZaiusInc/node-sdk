import fetch, {Headers} from 'node-fetch';
import {InternalConfig} from '../config/configure';
import {joinUri} from './joinUri';

let config!: InternalConfig;

/**
 * The core of all v3 API interfaces.
 */
export namespace ApiV3 {
  export function configure(newConfig: InternalConfig) {
    config = newConfig;
  }

  /**
   * The response payload format of a Zaius v3 API call
   */
  export interface V3Response {
    title: string;
    status: number;
    timestamp: string;
    message?: string;
    detail?: {
      invalids?: Array<{event: number, message: string, [key: string]: any}>
      [key: string]: any;
    };
  }

  /**
   * An http response from a v3 API call
   */
  export interface HttpResponse<T extends V3Response = V3Response> {
    success: boolean;
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
  }

  export enum ErrorCode {
    BatchLimitExceeded = 'BatchLimitExceeded',
    Non2xx = 'Non2xx',
    Unexpected = 'Unexpected'
  }

  const ERROR_CODE_MESSAGES: {[key in ErrorCode]: string} = {
    [ErrorCode.BatchLimitExceeded]: 'A maximum batch size of 500 is allowed in a single request',
    [ErrorCode.Non2xx]: 'Http response was outside 2xx',
    [ErrorCode.Unexpected]: 'An unexpected error occurred making the request'
  };

  export class HttpError<T extends V3Response = V3Response> extends Error {
    constructor(message: string, public code?: string, public response?: HttpResponse<T>) {
      super(message);
    }
  }

  type Payload = object | object[];

  type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE';

  interface RequestOptions {
    retry: boolean;
  }

  const DEFAULT_REQUEST_OPTIONS = {
    retry: true
  };

  export function errorForCode(code: ErrorCode): ApiV3.HttpError {
    return new HttpError(ERROR_CODE_MESSAGES[code], code);
  }

  export function post<T extends V3Response>(path: string, payload: Payload) {
    return request<T>('POST', path, payload);
  }

  export function request<T extends V3Response>(
    method: HttpMethod,
    path: string,
    payload: Payload,
    options: RequestOptions = {...DEFAULT_REQUEST_OPTIONS}
  ): Promise<HttpResponse<T>> {
    const url = joinUri(config.apiBasePath, path);
    const body = JSON.stringify(payload);

    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(url, {method, headers: buildHeaders(), body});

        const {status, statusText, headers} = response;
        if (status >= 200 && status <= 299) {
          const data: T = await response.json();
          const httpResponse: HttpResponse<T> = {
            success: true,
            data,
            status,
            statusText,
            headers
          };
          resolve(httpResponse);
        } else {
          let retryable = false;
          if (response.status >= 502 && response.status <= 504) {
            retryable = true;
          }

          if (retryable && options.retry) {
            ApiV3.request<T>(method, path, payload, {retry: false}).then((_result) => {
              resolve(_result);
            }, (_error) => {
              console.error(_error);
              reject(_error);
            });
          } else {
            let httpResponse: HttpResponse<T> | undefined;
            httpResponse = {
              success: false,
              data: await response.json(),
              status,
              statusText,
              headers
            };
            const httpError = new HttpError<T>(response.statusText, ErrorCode.Non2xx, httpResponse);
            console.error(httpError);
            reject(httpError);
          }
        }
      } catch (error) {
        const httpError = new HttpError<T>(error.message, ErrorCode.Unexpected);
        httpError.stack = error.stack;
        reject(httpError);
      }
    });
  }

  function buildHeaders() {
    const headersObject: {[key: string]: string} = {
      'x-api-key': config.publicApiKey,
      'Content-Type': 'application/json'
    };
    // TODO: Need a way to send an originating request id rather than have
    // all v3 api calls use the same request id for a webhook
    // if (config.requestId) {
    //   headersObject['z-request-id'] = config.requestId;
    // }
    return headersObject;
  }
}
