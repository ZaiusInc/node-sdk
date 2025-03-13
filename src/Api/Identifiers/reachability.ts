import {ApiV3} from '../lib/ApiV3';
import {GetReachabilityResponse, ReachabilityUpdate} from '../Types';

/**
 * Update reachability of a messaging identifier
 * @param apiV3 the v3 API instance to use
 * @param updates one or more updates to reachability for specific identifier values
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function updateReachability(
  apiV3: ApiV3.API,
  updates: ReachabilityUpdate | ReachabilityUpdate[],
): Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>> {
  if (!Array.isArray(updates)) {
    updates = [updates];
  }

  if (updates.length > ApiV3.BATCH_LIMIT) {
    throw apiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded);
  }

  // if we're going to make changes, clone the array first
  if (updates.some((u) => typeof u.reachable_update_ts !== 'number')) {
    updates = [...updates];
  }

  for (let i = 0; i < updates.length; i++) {
    const update = updates[i];
    let ts = update.reachable_update_ts;
    if (typeof ts === 'string') {
      ts = new Date(ts);
    }
    if (ts instanceof Date) {
      // create a new object to not modify the incoming object
      updates[i] = {...update, reachable_update_ts: Math.round(ts.getTime() / 1000)};
    }
  }

  return await apiV3.post('/reachability', updates);
}

/**
 * Get reachability information about an identifier
 * @param apiV3 the v3 API instance to use
 * @param identifierName The name of the messaging identifier field for which you want to check reachability
 * @param value The identifier value to lookup, e.g., a specific email address when identifierName is `email`
 */
export async function getReachability(
  apiV3: ApiV3.API,
  identifierName: string,
  value: string,
): Promise<ApiV3.HttpResponse<GetReachabilityResponse>> {
  return await apiV3.get(`/reachability/${encodeURIComponent(identifierName)}?id=${encodeURIComponent(value)}`);
}
