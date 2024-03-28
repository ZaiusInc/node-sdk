import {isNumber} from 'util';
import {ApiV3} from '../lib/ApiV3';
import {ConsentUpdate, GetConsentResponse} from '../Types';

/**
 * Update consent of a messaging identifier
 * @param apiV3 the v3 API instance to use
 * @param updates one or more updates to consent for specific identifier values
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function updateConsent(
  apiV3: ApiV3.API,
  updates: ConsentUpdate | ConsentUpdate[]
): Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>> {
  if (!Array.isArray(updates)) {
    updates = [updates];
  }

  if (updates.length > ApiV3.BATCH_LIMIT) {
    throw apiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded);
  }

  // if we're going to make changes, clone the array first
  if (updates.some((u) => !isNumber(u.consent_update_ts))) {
    updates = [...updates];
  }

  for (let i = 0; i < updates.length; i++) {
    const update = updates[i];
    let ts = update.consent_update_ts;
    if (typeof ts === 'string') {
      ts = new Date(ts);
    }
    if (ts instanceof Date) {
      // create a new object to not modify the incoming object
      updates[i] = {...update, consent_update_ts: Math.round(ts.getTime() / 1000)};
    }
  }

  return await apiV3.post('/consent', updates);
}

/**
 * Get consent information about an identifier
 * @param apiV3 the v3 API instance to use
 * @param identifierName The name of the messaging identifier field for which you want to check consent
 * @param identifierValue The identifier value to lookup, e.g., a specific email address when identifierName is `email`
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function getConsent(
  apiV3: ApiV3.API,
  identifierName: string,
  identifierValue: string
): Promise<ApiV3.HttpResponse<GetConsentResponse>> {
  return await apiV3.get(`/consent/${encodeURIComponent(identifierName)}?id=${encodeURIComponent(identifierValue)}`);
}
