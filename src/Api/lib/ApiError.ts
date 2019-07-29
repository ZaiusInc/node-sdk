import {ApiV3} from './ApiV3';

export class ApiError extends ApiV3.HttpError {
  constructor(source: ApiV3.HttpError) {
    super(source.message, source.code, source.response);
  }
}
