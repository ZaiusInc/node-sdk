import {ApiV3} from '../lib/ApiV3';
import {Customer} from '../Types';

/**
 * Send a customer or a batch of customers to Zaius.
 * @param payload a Zaius customer payload or an array of customer payloads
 * @returns the response from the API if successful
 * @throws [[HttpError]] if it receives a non-2XX result or if the batch size is > 500
 */
export function customer(payload: Customer | Customer[]): Promise<ApiV3.HttpResponse> {
  let transformedPayload;
  if (Array.isArray(payload)) {
    if (payload.length > 500) {
      return Promise.reject(ApiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded));
    }
    transformedPayload = payload.map(transformPayload);
  } else {
    transformedPayload = transformPayload(payload);
  }
  return ApiV3.post('/profiles', transformedPayload);
}

function transformPayload(payload: Customer) {
  // For now, we have to combine the identifiers back in with the rest of the attributes. This will go away once the
  // HTTP API is updated to accept the identifiers separately.
  return {attributes: {...payload.attributes, ...payload.identifiers}};
}
