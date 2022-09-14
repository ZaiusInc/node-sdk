import fetch, {Headers} from 'node-fetch';
import {InternalConfig} from '../config/configure';
import {RequestDetail} from '../config/RequestInterceptor';
import {joinUri} from './joinUri';

let config!: InternalConfig;

/**
 * The core of all v3 API interfaces.
 */
export namespace ApiV3 {
  export const BATCH_LIMIT = 100;
  export function configure(newConfig: InternalConfig) {
    config = newConfig;
  }

  /**
   * Generic response format of any Zaius v3 API call
   */
  export interface V3Response {
    [key: string]: any;
  }

  /**
   * Standard 200/202 response format for many Zaius v3 API calls
   */
  export interface V3SuccessResponse {
    title: 'Accepted' | string;
    status: 202 | 200 | number;
    timestamp: string;
  }

  /**
   * The error response payload format of a Zaius v3 API call
   */
  export interface V3ErrorResponse {
    title: string;
    status: 400 | 500 | number;
    timestamp: string;
    message?: string;
    detail?: {
      invalids?: V3InvalidEventDetail[] | V3InvalidSchemaDetail[];
      [key: string]: any;
    };
  }

  /**
   * Embedded error response detail format for invalid event
   */
  export interface V3InvalidEventDetail {
    event: number;
    message: string;
    [key: string]: any;
  }

  /**
   * Embedded error response detail format for invalid schema
   */
  export interface V3InvalidSchemaDetail {
    field: string;
    reason: string | string[];
  }

  /**
   * An http response from a v3 API call
   */
  export interface HttpResponse<T extends V3Response> {
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

  /**
   * @hidden
   */
  export function getAppContext() {
    return config.appContext;
  }

  const ERROR_CODE_MESSAGES: {[key in ErrorCode]: string} = {
    [ErrorCode.BatchLimitExceeded]: `A maximum batch size of ${BATCH_LIMIT} is allowed in a single request`,
    [ErrorCode.Non2xx]: 'Http response was outside 2xx',
    [ErrorCode.Unexpected]: 'An unexpected error occurred making the request'
  };

  export class HttpError extends Error {
    public constructor(message: string, public code?: string, public response?: HttpResponse<V3ErrorResponse>) {
      super(message);
    }
  }

  type Payload = object | object[];

  /**
   * http request method
   */
  export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE';

  interface RequestOptions {
    retry: boolean;
  }

  const DEFAULT_REQUEST_OPTIONS = {
    retry: true
  };

  export function errorForCode(code: ErrorCode): ApiV3.HttpError {
    return new HttpError(ERROR_CODE_MESSAGES[code], code);
  }

  export function get<T extends V3Response>(path: string) {
    return request<T>('GET', path, undefined);
  }

  export function post<T extends V3Response>(path: string, payload: Payload) {
    return request<T>('POST', path, payload);
  }

  export function request<T extends V3Response>(
    method: HttpMethod,
    path: string,
    payload: Payload | undefined,
    options: RequestOptions = {...DEFAULT_REQUEST_OPTIONS}
  ): Promise<HttpResponse<T>> {
    let url = joinUri(config.apiBasePath, path);
    const body = payload === undefined ? undefined : JSON.stringify(payload);

    return new Promise(async (resolve, reject) => {
      const requestLog: any[] = [];
      try {
        // Allow requests to be monitored or manipulated
        let requestInfo: RequestDetail = {method, headers: buildHeaders(), body};
        if (config.requestInterceptor) {
          [url, requestInfo] = config.requestInterceptor(url, requestInfo);
        }

        if (process.env['LOG_REQUESTS'] === 'true') {
          requestLog.push(`API V3 Request: ${url}`, requestInfo);
        }
        const response = await fetch(url, requestInfo);

        const {status, statusText, headers} = response;
        if (status >= 200 && status <= 299) {
          const data: T = await response.json();
          if (process.env['LOG_REQUESTS'] === 'true') {
            requestLog.push(`(${response.status}) body:`, JSON.stringify(data));
            console.debug(...requestLog);
          }
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
            ApiV3.request<T>(method, path, payload, {retry: false}).then(
              (result) => {
                resolve(result);
              },
              (error) => {
                reject(error);
              }
            );
          } else {
            const httpResponse: HttpResponse<V3ErrorResponse> = {
              success: false,
              data: await response.json(),
              status,
              statusText,
              headers
            };
            const httpError = new HttpError(response.statusText, ErrorCode.Non2xx, httpResponse);
            if (process.env['LOG_REQUESTS'] === 'true') {
              requestLog.push(`(${response.status}) body:`, JSON.stringify(httpResponse.data));
              console.debug(...requestLog);
            } else {
              console.error(httpError, JSON.stringify(httpResponse.data));
            }
            reject(httpError);
          }
        }
      } catch (error: any) {
        if (process.env['LOG_REQUESTS'] === 'true') {
          requestLog.push('Unexpected Error:', error.message, error.stack);
          console.debug(...requestLog);
        }
        const httpError = new HttpError(error.message, ErrorCode.Unexpected);
        httpError.stack = error.stack;
        reject(httpError);
      }
    });
  }

  function buildHeaders() {
    const headersObject: {[key: string]: string} = {
      'x-api-key': config.apiKey,
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
