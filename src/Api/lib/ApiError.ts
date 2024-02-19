import {HttpError} from './HttpError';

export class ApiError extends HttpError {
  public constructor(source: HttpError) {
    super(source.message, source.code, source.response);
  }
}
