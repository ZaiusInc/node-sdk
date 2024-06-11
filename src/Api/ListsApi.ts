import {Lists} from './List';
import {ApiV3} from './lib/ApiV3';
import {CreateListResponse, GetListsResponse, ListUpdateRequest, ListUpdateResponse} from './Types/Lists';
import {Identifiers} from './Types';
import {ODPClient} from './index';
import { createList as lists_createList, getLists as lists_getLists } from './List/lists';
import {
  subscribe as subscriptions_subscribe,
  unsubscribe as subscriptions_unsubscribe,
  updateSubscriptions as subscriptions_updateSubscriptions
} from './List/subscriptions';

export class ListsApi implements Lists {

  public constructor(private client: ODPClient) {
  }

  public createList = (
    listName: string
  ): Promise<ApiV3.HttpResponse<CreateListResponse>> => lists_createList(this.client.v3Api, listName);

  public getLists = (): Promise<ApiV3.HttpResponse<GetListsResponse>> => lists_getLists(this.client.v3Api);

  public subscribe = (
    listId: string,
    identifiers: Identifiers | Identifiers[]
  ): Promise<ApiV3.HttpResponse<ListUpdateResponse>> => subscriptions_subscribe(this.client.v3Api, listId, identifiers);

  public unsubscribe = (
    listId: string,
    identifiers: Identifiers | Identifiers[]
  ): Promise<ApiV3.HttpResponse<ListUpdateResponse>> => subscriptions_unsubscribe(
    this.client.v3Api,
    listId,
    identifiers
  );

  public updateSubscriptions = (
    listId: string,
    updates: ListUpdateRequest[]
  ): Promise<ApiV3.HttpResponse<ListUpdateResponse>> => subscriptions_updateSubscriptions(
    this.client.v3Api,
    listId,
    updates
  );

}
