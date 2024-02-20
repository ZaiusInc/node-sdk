import { ODPClient } from './index';
import * as lists from './List/lists';
import * as subscriptions from './List/subscriptions';
import {ListsApi} from './ListsApi';
import {ListUpdateRequest} from './Types/Lists';

describe('ListsApi', () => {
  let api: ListsApi;
  let odpClient: ODPClient;

  beforeEach(() => {
    odpClient = new ODPClient();
    api = new ListsApi(odpClient);
  });

  it('should create list',
    async () => {
      jest.spyOn(lists, 'createList').mockReturnValue(Promise.resolve({} as any));

      const listName = 'testName';
      await api.createList(listName);
      expect(lists.createList).toHaveBeenCalledWith(odpClient.v3Api, listName);
    });

  it('should get lists',
    async () => {
      jest.spyOn(lists, 'getLists').mockReturnValue(Promise.resolve({} as any));

      await api.getLists();
      expect(lists.getLists).toHaveBeenCalledWith(odpClient.v3Api);
    });

  it('should subscribe',
    async () => {
      jest.spyOn(subscriptions, 'subscribe').mockReturnValue(Promise.resolve({} as any));

      const listId = 'testId';
      const identifiers = {
        email: 'test@mail.com'
      };
      await api.subscribe(listId, identifiers);
      expect(subscriptions.subscribe).toHaveBeenCalledWith(odpClient.v3Api, listId, identifiers);
    });

  it('should unsubscribe',
    async () => {
      jest.spyOn(subscriptions, 'unsubscribe').mockReturnValue(Promise.resolve({} as any));

      const listId = 'testId';
      const identifiers = {
        email: 'test@mail.com'
      };
      await api.unsubscribe(listId, identifiers);
      expect(subscriptions.unsubscribe).toHaveBeenCalledWith(odpClient.v3Api, listId, identifiers);
    });

  it('should update subscription',
    async () => {
      jest.spyOn(subscriptions, 'updateSubscriptions').mockReturnValue(Promise.resolve({} as any));

      const listId = 'testId';
      const updates: ListUpdateRequest[] = [{
        subscribed: true,
        'email': 'test@mail.com'
      }];
      await api.updateSubscriptions(listId, updates);
      expect(subscriptions.updateSubscriptions).toHaveBeenCalledWith(odpClient.v3Api, listId, updates);
    });

});
