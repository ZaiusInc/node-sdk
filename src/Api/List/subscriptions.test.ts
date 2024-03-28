import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {ListUpdateRequest} from '../Types/Lists';
import {subscribe, unsubscribe, updateSubscriptions} from './subscriptions';

const mockConfiguration: InternalConfig = {
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key'
};

let apiV3: ApiV3.API;

describe('subscriptions', () => {
  beforeAll(() => {
    apiV3 = new ApiV3.API(mockConfiguration);
  });

  describe('subscribe', () => {
    it('subscribes a user to a list', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      await subscribe(apiV3, 'everybody', {email: 'foo@optimizely.com'});
      expect(postFn).toHaveBeenCalledWith('/lists/subscriptions', [
        {
          list_id: 'everybody',
          email: 'foo@optimizely.com',
          subscribed: true
        }
      ]);
      postFn.mockRestore();
    });

    it('subscribes multiple users to a list', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      await subscribe(
        apiV3,
        'everybody',
        [{email: 'foo@optimizely.com'}, {email: 'bar@optimizely.com', phone: '+15555550000'}]
      );
      expect(postFn).toHaveBeenCalledWith('/lists/subscriptions', [
        {
          list_id: 'everybody',
          email: 'foo@optimizely.com',
          subscribed: true
        },
        {
          list_id: 'everybody',
          email: 'bar@optimizely.com',
          phone: '+15555550000',
          subscribed: true
        }
      ]);
      postFn.mockRestore();
    });
  });

  describe('unsubscribe', () => {
    it('unsubscribes a user to a list', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      await unsubscribe(apiV3, 'everybody', {email: 'foo@optimizely.com'});
      expect(postFn).toHaveBeenCalledWith('/lists/subscriptions', [
        {
          list_id: 'everybody',
          email: 'foo@optimizely.com',
          subscribed: false
        }
      ]);
      postFn.mockRestore();
    });

    it('unsubscribes multiple users to a list', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      await unsubscribe(
        apiV3,
        'everybody',
        [{email: 'foo@optimizely.com'}, {email: 'bar@optimizely.com', phone: '+15555550000'}]
      );
      expect(postFn).toHaveBeenCalledWith('/lists/subscriptions', [
        {
          list_id: 'everybody',
          email: 'foo@optimizely.com',
          subscribed: false
        },
        {
          list_id: 'everybody',
          email: 'bar@optimizely.com',
          phone: '+15555550000',
          subscribed: false
        }
      ]);
      postFn.mockRestore();
    });
  });

  describe('updateSubscriptions', () => {
    it('updates multiple subscriptions', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      await updateSubscriptions(apiV3, 'everybody', [
        {email: 'foo@optimizely.com', list_id: 'foo_only', subscribed: true},
        {email: 'bar@optimizely.com', phone: '+15555550000', subscribed: false}
      ]);
      expect(postFn).toHaveBeenCalledWith('/lists/subscriptions', [
        {
          list_id: 'foo_only',
          email: 'foo@optimizely.com',
          subscribed: true
        },
        {
          list_id: 'everybody',
          email: 'bar@optimizely.com',
          phone: '+15555550000',
          subscribed: false
        }
      ]);
    });

    it('throws an error if the batch limit is exceeded', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      const updates = Array(101).fill({
        list_id: 'nobody',
        email: 'foo@optimizely.com',
        subscribed: false
      } as ListUpdateRequest);
      await expect(updateSubscriptions(apiV3, 'everybody', updates)).rejects.toThrowError('maximum batch size');
      postFn.mockRestore();
    });

    it('throws an error if the api returns an error', async () => {
      const postFn = jest
        .spyOn(apiV3, 'post')
        .mockRejectedValueOnce(new ApiV3.HttpError('Bad Request', undefined, {} as any));
      await expect(
        updateSubscriptions(apiV3, 'foo', [
          {
            list_id: 'nobody',
            email: 'foo@optimizely.com',
            subscribed: false
          }
        ])
      ).rejects.toThrowError('Bad Request');
      postFn.mockRestore();
    });
  });
});
