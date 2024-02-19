import {ApiV3} from '../lib/ApiV3';
import {CustomerPayload, CustomerResponse, FieldValue, PayloadOptions} from '../Types';
import {PayloadSanitizer} from '../lib/PayloadSanitizer';

/**
 * @hidden
 */
interface TransformedCustomerPayload {
  attributes: {
    [field: string]: FieldValue | undefined;
  };
}

/**
 * Send a customer or a batch of customers to ODP.
 *
 * @param apiV3 the v3 API instance to use
 * @param payload an ODP customer payload or an array of customer payloads
 * @param opts a PayloadOptions instance defaults are trimToNull & excludeNulls
 * @returns the response from the API if successful
 * @throws {HttpError} if it receives a non-2XX result or if the batch size is > BATCH_LIMIT
 */
export function customer(
  apiV3: ApiV3.API,
  payload: CustomerPayload | CustomerPayload[],
  opts?: PayloadOptions
): Promise<ApiV3.HttpResponse<CustomerResponse>> {
  let transformedPayload;
  if (Array.isArray(payload)) {
    if (payload.length > ApiV3.BATCH_LIMIT) {
      return Promise.reject(apiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded));
    }
    transformedPayload = payload.map(transformPayload);
    transformedPayload.forEach((p) => PayloadSanitizer.sanitize(p.attributes, opts));
  } else {
    transformedPayload = transformPayload(payload);
    PayloadSanitizer.sanitize(transformedPayload.attributes, opts);
  }
  return apiV3.post('/profiles', transformedPayload);
}

function transformPayload(payload: CustomerPayload): TransformedCustomerPayload {
  // For now, we have to combine the identifiers back in with the rest of the attributes. This will go away once the
  // HTTP API is updated to accept the identifiers separately.
  return {attributes: {...payload.attributes, ...payload.identifiers}};
}
