import {ApiV3} from '../lib/ApiV3';

export interface RequestDetail {
  method: ApiV3.HttpMethod;
  headers: {[key: string]: string};
  body?: string;
}

export type RequestInterceptor = (url: string, request: RequestDetail) => [string, RequestDetail];
