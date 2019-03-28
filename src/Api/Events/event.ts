import {ApiV3} from '../lib/ApiV3';
import {Event} from '../Types';

/**
 * Send an event or a batch of events to Zaius
 * @param payload a Zaius event payload or an array of event payloads
 * @returns Promise<ApiV3.HttpResponse> containing the response from the API if successful
 * @throws ApiV3.HttpError if it receives a non-2XX result or if the batch size is > 500
 */
export function event(payload: Event | Event[]): Promise<ApiV3.HttpResponse> {
  if (Array.isArray(payload) && payload.length > 500) {
    return Promise.reject(ApiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded));
  }
  return ApiV3.post('/events', payload);
}
