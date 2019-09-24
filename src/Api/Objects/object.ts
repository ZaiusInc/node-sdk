import {ApiV3} from '../lib/ApiV3';
import {ObjectPayload, ObjectResponse} from '../Types';
import {PayloadSanitizer, PayloadOptions} from '../lib/PayloadSanitizer';

/**
 * Send an object or a batch of objects to Zaius
 * @param type the object type, eg. 'products'
 * @param payload a Zaius object payload or an array of object payloads
 * @param opts a PayloadOptions instance defaults are trimToNull & excludeNulls
 * @returns the response from the API if successful
 * @throws {HttpError} if it receives a non-2XX result or if the batch size is > BATCH_LIMIT
 */
export function object(
  type: string,
  payload: ObjectPayload | ObjectPayload[],
  opts?: PayloadOptions
): Promise<ApiV3.HttpResponse<ObjectResponse>> {
  if (Array.isArray(payload) && payload.length > ApiV3.BATCH_LIMIT) {
    return Promise.reject(ApiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded));
  }

  (Array.isArray(payload) ? payload : [payload]).forEach((p) => PayloadSanitizer.sanitize(p, opts));
  return ApiV3.post(`/objects/${type}`, payload);
}
