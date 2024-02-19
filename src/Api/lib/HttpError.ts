import {ApiV3} from './ApiV3';

export class HttpError extends Error {
  public constructor(
    message: string,
    public code?: string,
    public response?: ApiV3.HttpResponse<ApiV3.V3ErrorResponse>
  ) {
    super(message);
  }
}
