import {createList, getLists} from './lists';
import {subscribe, unsubscribe, updateSubscriptions} from './subscriptions';
import {ApiV3, Identifiers} from '../Types';
import {CreateListResponse, GetListsResponse, ListUpdateRequest, ListUpdateResponse} from '../Types/Lists';

export const list = {
  createList,
  getLists,
  subscribe,
  unsubscribe,
  updateSubscriptions
};


export interface Lists {
  createList: (listName: string) => Promise<ApiV3.HttpResponse<CreateListResponse>>;
  getLists: () => Promise<ApiV3.HttpResponse<GetListsResponse>>;
  subscribe:
  (listId: string, identifiers: Identifiers | Identifiers[]) => Promise<ApiV3.HttpResponse<ListUpdateResponse>>;
  unsubscribe:
  (listId: string, identifiers: Identifiers | Identifiers[]) => Promise<ApiV3.HttpResponse<ListUpdateResponse>>;
  updateSubscriptions:
  (listId: string, updates: ListUpdateRequest[]) => Promise<ApiV3.HttpResponse<ListUpdateResponse>>;
}
