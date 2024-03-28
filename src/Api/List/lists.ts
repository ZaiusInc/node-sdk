import {ApiV3} from '../lib/ApiV3';
import {CreateListResponse, GetListsResponse} from '../Types/Lists';

/**
 * Create an ODP marketing list. If the list already exists, you will receive a 400.
 * @param apiV3 the v3 API instance to use
 * @param listName The human-readable name of the list that that will also be used to create the list id.
 * The strategy for converting a list name to a list id is to convert the name to lowercase and replace
 * non-alpha-numerics with `_`.
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function createList(apiV3: ApiV3.API, listName: string): Promise<ApiV3.HttpResponse<CreateListResponse>> {
  return await apiV3.post('/lists', {name: listName});
}

/**
 * Get all ODP marketing lists for the current account
 * @param apiV3 the v3 API instance to use
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function getLists(apiV3: ApiV3.API): Promise<ApiV3.HttpResponse<GetListsResponse>> {
  return await apiV3.get('/lists');
}
