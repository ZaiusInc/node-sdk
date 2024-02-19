import {ApiV3} from '../lib/ApiV3';
import {Identifiers} from '../Types';
import {ListUpdateRequest, ListUpdateResponse} from '../Types/Lists';

/**
 * Subscribe a customer or array of customers to a list
 * @param apiV3 the v3 API instance to use
 * @param listId The list id you want to subscribe the customer to
 * @param identifiers An object containing one or more messaging identifiers that will allow ODP to uniquely
 * identify this person. Provide an array of objects to subscribe multiple customers
 * @throws {HttpError} if it receives a non-2XX result or if the batch size is > BATCH_LIMIT
 */
export async function subscribe(
  apiV3: ApiV3.API,
  listId: string,
  identifiers: Identifiers | Identifiers[]
): Promise<ApiV3.HttpResponse<ListUpdateResponse>> {
  if (!Array.isArray(identifiers)) {
    identifiers = [identifiers];
  }
  return updateSubscriptions(
    apiV3,
    listId,
    identifiers.map((id) => ({...id, subscribed: true}))
  );
}

/**
 * Unsubscribe a customer or array of customers from a list
 * @param apiV3 the v3 API instance to use
 * @param listId The list id you want to unsubscribe the customer from
 * @param identifiers An object containing one or more messaging identifiers that will allow ODP to uniquely
 * identify this person. Provide an array of objects to unsubscribe multiple customers
 * @throws {HttpError} if it receives a non-2XX result or if the batch size is > BATCH_LIMIT
 */
export async function unsubscribe(
  apiV3: ApiV3.API,
  listId: string,
  identifiers: Identifiers | Identifiers[]
): Promise<ApiV3.HttpResponse<ListUpdateResponse>> {
  if (!Array.isArray(identifiers)) {
    identifiers = [identifiers];
  }
  return updateSubscriptions(
    apiV3,
    listId,
    identifiers.map((id) => ({...id, subscribed: false}))
  );
}

/**
 * Bulk update subscriptions for multiple customers to a list (or multiple lists).
 * @param apiV3 the v3 API instance to use
 * @param listId The default list id you want to subscribe the customers to. if list_id is not provided in the update,
 * this list will be used.
 * @param updates An array of updates to perform. An update is an object containing the identifier, a boolean for
 * subscribed, and optionally the list. If the list is not provided in an update object, the listId param will be used.
 * @throws {HttpError} if it receives a non-2XX result or if the batch size is > BATCH_LIMIT
 */
export async function updateSubscriptions(
  apiV3: ApiV3.API,
  listId: string,
  updates: ListUpdateRequest[]
): Promise<ApiV3.HttpResponse<ListUpdateResponse>> {
  if (updates.length > ApiV3.BATCH_LIMIT) {
    throw apiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded);
  }

  return await apiV3.post(
    '/lists/subscriptions',
    updates.map((update) => ({list_id: listId, ...update}))
  );
}
