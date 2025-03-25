/* eslint-disable max-classes-per-file */
import fetch, {Headers} from 'node-fetch';
import {RequestDetail} from '../config/RequestInterceptor';
import {joinUri} from './joinUri';
import {Config, configOrDefault, getModuleOrGlobalConfig, InternalConfig} from '../config/configure';

export namespace ApiV3 {
  export const BATCH_LIMIT = 100;

  /**
   * Generic response format of any ODP v3 API call
   */
  export interface V3Response {
    [key: string]: any;
  }

  /**
   * Standard 200/202 response format for many ODP v3 API calls
   */
  export interface V3SuccessResponse {
    title: 'Accepted' | string;
    status: 202 | 200 | number;
    timestamp: string;
  }

  /**
   * The error response payload format of an ODP v3 API call
   */
  export interface V3ErrorResponse {
    title: string;
    status: 400 | 500 | number;
    timestamp: string;
    message?: string;
    detail?: {
      [key: string]: any;
      invalids?: V3InvalidEventDetail[] | V3InvalidSchemaDetail[];
    };
  }

  /**
   * Embedded error response detail format for invalid event
   */
  export interface V3InvalidEventDetail {
    [key: string]: any;
    event: number;
    message: string;
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
    Unexpected = 'Unexpected',
  }

  export class HttpError extends Error {
    public constructor(
      message: string,
      public code?: string,
      public response?: HttpResponse<V3ErrorResponse>,
    ) {
      super(message);
    }
  }

  export type Payload = object | object[];

  /**
   * http request method
   */
  export type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE';

  export interface RequestOptions {
    retry: boolean;
  }

  export class API {
    private static ERROR_CODE_MESSAGES: {[key in ErrorCode]: string} = {
      [ErrorCode.BatchLimitExceeded]: `A maximum batch size of ${BATCH_LIMIT} is allowed in a single request`,
      [ErrorCode.Non2xx]: 'Http response was outside 2xx',
      [ErrorCode.Unexpected]: 'An unexpected error occurred making the request',
    };

    private static DEFAULT_REQUEST_OPTIONS = {
      retry: true,
    };

    /**
     * @hidden backward compatibility
     */
    public readonly BATCH_LIMIT = ApiV3.BATCH_LIMIT;

    private readonly config?: InternalConfig;

    public constructor(config: Config | InternalConfig | null) {
      if (config) {
        this.config = configOrDefault(config);
      }
    }

    public errorForCode = (code: ErrorCode): HttpError => new HttpError(API.ERROR_CODE_MESSAGES[code], code);

    public get = <T extends V3Response>(path: string) => this.request<T>('GET', path, undefined);

    public post = <T extends V3Response>(path: string, payload: Payload) => this.request<T>('POST', path, payload);

    public request = <T extends V3Response>(
      method: HttpMethod,
      path: string,
      payload: Payload | undefined,
      options: RequestOptions = {...API.DEFAULT_REQUEST_OPTIONS},
    ): Promise<HttpResponse<T>> => {
      let url = joinUri(this.getConfig().apiBasePath, path);
      const body = payload === undefined ? undefined : JSON.stringify(payload);

      return new Promise(async (resolve, reject) => {
        const requestLog: any[] = [];
        try {
          // Allow requests to be monitored or manipulated
          let requestInfo: RequestDetail = {method, headers: this.buildHeaders(), body};
          const interceptor = this.getConfig().requestInterceptor;
          if (interceptor) {
            [url, requestInfo] = interceptor(url, requestInfo);
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
              headers,
            };
            resolve(httpResponse);
          } else {
            let retryable = false;
            if (response.status >= 502 && response.status <= 504) {
              retryable = true;
            }

            if (retryable && options.retry) {
              this.request<T>(method, path, payload, {retry: false}).then(
                (result) => {
                  resolve(result);
                },
                (error: Error) => {
                  reject(error);
                },
              );
            } else {
              const contentType = response?.headers?.get('content-type');
              const text = await response.text();
              let data = null;
              if (contentType?.includes('application/json')) {
                try {
                  const json = JSON.parse(text);
                  data = json;
                } catch {
                  // nothing
                }
              }

              if (data == null) {
                data = {error: text};
              }

              const httpResponse: HttpResponse<V3ErrorResponse> = {
                success: false,
                data,
                status,
                statusText,
                headers,
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
    };

    public getContext = () => this.getConfig().appContext;

    private buildHeaders = () => {
      const headersObject: {[key: string]: string} = {
        'x-api-key': this.getConfig().apiKey,
        'Content-Type': 'application/json',
      };
      return headersObject;
    };

    private getConfig = (): InternalConfig => {
      if (this.config) {
        return this.config;
      } else {
        return getModuleOrGlobalConfig();
      }
    };
  }

  /**
   * @hidden for backward compatibility
   */
  const moduleScopeApi: API = new API(null);

  /**
   * @hidden
   * @deprecated for backward compatibility; use odp.v3Api.get instead
   */
  export function get<T extends V3Response>(path: string) {
    return moduleScopeApi.get<T>(path);
  }

  /**
   * @hidden
   * @deprecated for backward compatibility; use odp.v3Api.post instead
   */
  export function post<T extends V3Response>(path: string, payload: Payload) {
    return moduleScopeApi.post<T>(path, payload);
  }
}
