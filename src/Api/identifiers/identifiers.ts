import {ApiV3} from '../lib/ApiV3';
import {IdentifierMetadata, IdentifierMetadataResponse} from '../Types';

/**
 * Update metadata for a customer's identifier
 * @param identifierFieldName The name of the identifier field you want to update, e.g., email
 * @param identifierValue An existing identifier value, such as a known email address
 * @param update the update to perform
 * @throws {HttpError} if it receives any other non-2XX result
 */
export async function updateMetadata(
  identifierFieldName: string,
  identifierValue: string,
  metadata: IdentifierMetadata
): Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>> {
  const request = {
    identifier_field_name: identifierFieldName,
    identifier_value: identifierValue,
    metadata
  };
  return await ApiV3.post('/identifiers', request);
}

/**
 * Get metadata for a customer's identifier
 * @param identifierFieldName The name of the identifier field you want to get metadata on, e.g., email
 * @param identifierValue An existing identifier value, such as a known email address
 * @param update the update to perform
 * @throws {HttpError} if it receives any other non-2XX result
 */
export async function getMetadata(
  identifierFieldName: string,
  identifierValue: string
): Promise<ApiV3.HttpResponse<IdentifierMetadataResponse>> {
  return await ApiV3.get<IdentifierMetadataResponse>(
    `/identifiers/${encodeURIComponent(identifierFieldName)}?id=${encodeURIComponent(identifierValue)}`
  );
}
