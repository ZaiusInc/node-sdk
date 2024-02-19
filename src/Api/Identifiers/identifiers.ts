import {ApiV3} from '../lib/ApiV3';
import {IdentifierMetadata, IdentifierMetadataResponse} from '../Types';

/**
 * Update metadata for a customer's identifier
 * @param apiV3 the v3 API instance to use
 * @param updates one or more metadata updates for specific identifier values
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function updateMetadata(
  apiV3: ApiV3.API,
  updates: IdentifierMetadata | IdentifierMetadata[]
): Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>> {
  if (!Array.isArray(updates)) {
    updates = [updates];
  }

  if (updates.length > ApiV3.BATCH_LIMIT) {
    throw apiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded);
  }

  return await apiV3.post('/identifiers', updates);
}

/**
 * Get metadata for a customer's identifier
 * @param apiV3 the v3 API instance to use
 * @param identifierFieldName The name of the identifier field you want to get metadata on, e.g., email
 * @param identifierValue An existing identifier value, such as a known email address
 * @param update the update to perform
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function getMetadata(
  apiV3: ApiV3.API,
  identifierFieldName: string,
  identifierValue: string
): Promise<ApiV3.HttpResponse<IdentifierMetadataResponse>> {
  return await apiV3.get<IdentifierMetadataResponse>(
    `/identifiers/${encodeURIComponent(identifierFieldName)}?id=${encodeURIComponent(identifierValue)}`
  );
}
