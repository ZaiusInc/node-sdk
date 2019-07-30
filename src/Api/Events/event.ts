import {ApiV3} from '../lib/ApiV3';
import {EventPayload} from '../Types';

/**
 * Send an event or a batch of events to Zaius
 * @param payload a Zaius event payload or an array of event payloads
 * @returns the response from the API if successful
 * @throws {HttpError} if it receives a non-2XX result or if the batch size is > BATCH_LIMIT
 */
export function event(payload: EventPayload | EventPayload[]): Promise<ApiV3.HttpResponse> {
  if (Array.isArray(payload) && payload.length > ApiV3.BATCH_LIMIT) {
    return Promise.reject(ApiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded));
  }
  return ApiV3.post('/events', payload);
}
