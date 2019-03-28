import Axios, {AxiosError, AxiosResponse} from 'axios';
import {ApiConfig} from './configure';
import {joinUri} from './joinUri';

let config!: ApiConfig;

export namespace ApiV3 {
  export function configure(newConfig: ApiConfig) {
    config = newConfig;
  }

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

  export interface HttpResponse<T extends V3Response = V3Response> {
    success: boolean;
    data: T;
    status: number;
    statusText: string;
    headers: any;
  }

  export enum ErrorCode {
    BatchLimitExceeded = 'BatchLimitExceeded'
  }

  const ERROR_CODE_MESSAGES: {[key in ErrorCode]: string} = {
    [ErrorCode.BatchLimitExceeded]: 'A maximum of 500 events are allowed in a single request'
  };

  export interface HttpError<T extends V3Response = V3Response> extends Error {
    code?: string;
    response?: HttpResponse<T>;
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
    return {
      name: code,
      message: ERROR_CODE_MESSAGES[code],
      code
    };
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
    const data = JSON.stringify(payload);
    return new Promise((resolve, reject) => {
      Axios.request({
        method,
        url,
        headers: buildHeaders(),
        data
      }).then((response: AxiosResponse<T>) => {
        const {status, statusText, headers, data: result} = response;
        const httpResponse: HttpResponse<T> = {
          success: true,
          data: result,
          status,
          statusText,
          headers
        };
        resolve(httpResponse);
      }, (error: AxiosError) => {
        let retryable = false;
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status >= 502 && error.response.status <= 504) {
            retryable = true;
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of http.ClientRequest in node.js
          retryable = true;
        }

        if (retryable && options.retry) {
          request<T>(method, path, payload, {retry: false}).then((_result) => {
            resolve(_result);
          }, (_error) => {
            console.error(_error);
            reject(_error);
          });
        } else {
          let httpResponse: HttpResponse<T> | undefined;
          if (error.response) {
            const {status, statusText, headers, data: result} = error.response;
            httpResponse = {
              success: false,
              data: result,
              status,
              statusText,
              headers
            };
          }
          const httpError: HttpError<T> = {
            name: error.name,
            message: error.message,
            code: error.code,
            response: httpResponse,
            stack: error.stack
          };
          console.error(httpError);
          reject(httpError);
        }
      });
    });
  }

  function buildHeaders() {
    const headersObject: {[key: string]: string} = {
      'x-api-key': config.publicApiKey,
      'Content-Type': 'application/json'
    };
    if (config.requestId) {
      headersObject['z-request-id'] = config.requestId;
    }
    return headersObject;
  }
}
