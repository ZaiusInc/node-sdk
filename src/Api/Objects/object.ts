import {ApiV3} from '../lib/ApiV3';
import {ObjectPayload, ObjectResponse} from '../Types';

/**
 * Send an object or a batch of objects to Zaius
 * @param type the object type, eg. 'products'
 * @param payload a Zaius object payload or an array of object payloads
 * @returns the response from the API if successful
 * @throws {HttpError} if it receives a non-2XX result or if the batch size is > BATCH_LIMIT
 */
export function object(
  type: string,
  payload: ObjectPayload | ObjectPayload[]
): Promise<ApiV3.HttpResponse<ObjectResponse>> {
  if (Array.isArray(payload) && payload.length > ApiV3.BATCH_LIMIT) {
    return Promise.reject(ApiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded));
  }
  return ApiV3.post(`/objects/${type}`, payload);
}
