import {ApiV3} from '../lib/ApiV3';
import {CreateListResponse, GetListsResponse} from '../Types/Lists';

/**
 * Create a Zaius marketing list. If the list already exists, you will receive a 400.
 * @param listName The human readable name of the list that that will also be used to create the list id.
 * The strategy for converting a list name to a list id is to convert the name to lowercase and replace
 * non-alpha-numerics with `_`.
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function createList(listName: string): Promise<ApiV3.HttpResponse<CreateListResponse>> {
  return await ApiV3.post('/lists', {name: listName});
}

/**
 * Get all Zaius marketing lists for the current account
 * @throws {HttpError} if it receives any non-2XX result
 */
export async function getLists(): Promise<ApiV3.HttpResponse<GetListsResponse>> {
  return await ApiV3.get('/lists');
}
