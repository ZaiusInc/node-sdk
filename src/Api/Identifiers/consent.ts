import {ApiV3} from '../lib/ApiV3';
import {ConsentUpdate, GetConsentResponse} from '../Types';

/**
 * Update consent of a messaging identifier
 * @param identifierFieldName The name of the messaging identifier field you want to update, e.g., email
 * @param identifierValue A valid messaging identifier value, such as an email address for the email identifier
 * @param update the update to perform
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function updateConsent(
  identifierFieldName: string,
  identifierValue: string,
  update: ConsentUpdate
): Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>> {
  const request = {
    ...update,
    identifier_field_name: identifierFieldName,
    identifier_value: identifierValue
  };
  if (update.consent_update_ts instanceof Date) {
    request.consent_update_ts = update.consent_update_ts.toISOString();
  }
  return await ApiV3.post('/consent', request);
}

/**
 * Get consent information about an identifier
 * @param identifierName The name of the messaging identifier field for which you want to check consent
 * @param value The identifier value to lookup, e.g., a specific email address when identifierName is `email`
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function getConsent(
  identifierName: string,
  value: string
): Promise<ApiV3.HttpResponse<GetConsentResponse>> {
  return await ApiV3.get(`/consent/${encodeURIComponent(identifierName)}?id=${encodeURIComponent(value)}`);
}
