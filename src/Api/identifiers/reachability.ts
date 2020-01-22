import {ApiV3} from '../lib/ApiV3';
import {GetReachabilityResponse, ReachabilityUpdate} from '../Types';

/**
 * Update reachability of a messaging identifier
 * @param identifierFieldName The name of the messaging identifier field you want to update, e.g., email
 * @param identifierValue A valid messaging identifier value, such as an email address for the email identifier
 * @param update the update to perform
 * @throws {HttpError} if it receives any other non-2XX result
 */
export async function updateReachability(
  identifierFieldName: string,
  identifierValue: string,
  update: ReachabilityUpdate
): Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>> {
  const request = {
    ...update,
    identifier_field_name: identifierFieldName,
    identifier_value: identifierValue
  };
  if (update.reachable_update_ts instanceof Date) {
    request.reachable_update_ts = update.reachable_update_ts.toISOString();
  }
  return await ApiV3.post('/reachability', request);
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
