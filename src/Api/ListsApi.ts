import {Lists} from './List';
import {ApiV3} from './lib/ApiV3';
import {CreateListResponse, GetListsResponse, ListUpdateRequest, ListUpdateResponse} from './Types/Lists';
import {Identifiers} from './Types';
import {ODPClient} from './index';
import { createList, getLists } from './List/lists';
import { subscribe, unsubscribe, updateSubscriptions } from './List/subscriptions';

export class ListsApi implements Lists {

  public constructor(private client: ODPClient) {
  }

  public createList(listName: string): Promise<ApiV3.HttpResponse<CreateListResponse>> {
    return createList(this.client.v3Api, listName);
  }

  public getLists(): Promise<ApiV3.HttpResponse<GetListsResponse>> {
    return getLists(this.client.v3Api);
  }

  public subscribe(
    listId: string,
    identifiers: Identifiers | Identifiers[]
  ): Promise<ApiV3.HttpResponse<ListUpdateResponse>> {
    return subscribe(this.client.v3Api, listId, identifiers);
  }

  public unsubscribe(
    listId: string,
    identifiers: Identifiers | Identifiers[]
  ): Promise<ApiV3.HttpResponse<ListUpdateResponse>> {
    return unsubscribe(this.client.v3Api, listId, identifiers);
  }

  public updateSubscriptions(
    listId: string,
    updates: ListUpdateRequest[]
  ): Promise<ApiV3.HttpResponse<ListUpdateResponse>> {
    return updateSubscriptions(this.client.v3Api, listId, updates);
  }

}
