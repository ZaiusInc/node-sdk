import {isNumber} from 'util';
import {ApiV3} from '../lib/ApiV3';
import {GetReachabilityResponse, ReachabilityUpdate} from '../Types';

/**
 * Update reachability of a messaging identifier
 * @param updates one or more updates to reachability for specific identifier values
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function updateReachability(
  updates: ReachabilityUpdate | ReachabilityUpdate[]
): Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>> {
  if (!Array.isArray(updates)) {
    updates = [updates];
  }

  if (updates.length > ApiV3.BATCH_LIMIT) {
    throw ApiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded);
  }

  // if we're going to make changes, clone the array first
  if (updates.some((u) => !isNumber(u.reachable_update_ts))) {
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

  return await ApiV3.post('/reachability', updates);
}

/**
 * Get reachability information about an identifier
 * @param identifierName The name of the messaging identifier field for which you want to check reachability
 * @param value The identifier value to lookup, e.g., a specific email address when identifierName is `email`
 */
export async function getReachability(
  identifierName: string,
  value: string
): Promise<ApiV3.HttpResponse<GetReachabilityResponse>> {
  return await ApiV3.get(`/reachability/${encodeURIComponent(identifierName)}?id=${encodeURIComponent(value)}`);
}
