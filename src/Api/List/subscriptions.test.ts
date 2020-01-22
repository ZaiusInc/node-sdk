import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {ListUpdateRequest} from '../Types/Lists';
import {subscribe, unsubscribe, updateSubscriptions} from './subscriptions';

const mockConfiguration: InternalConfig = {
  trackerId: 'vdl',
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key'
};

describe('subscriptions', () => {
  beforeAll(() => {
    ApiV3.configure(mockConfiguration);
  });

  describe('subscribe', () => {
    it('subscribes a user to a list', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      await subscribe('everybody', {email: 'foo@zaius.com'});
      expect(postFn).toHaveBeenCalledWith('/lists/subscriptions', [
        {
          list_id: 'everybody',
          email: 'foo@zaius.com',
          subscribed: true
        }
      ]);
      postFn.mockRestore();
    });

    it('subscribes multiple users to a list', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      await subscribe('everybody', [{email: 'foo@zaius.com'}, {email: 'bar@zaius.com', phone: '+15555550000'}]);
      expect(postFn).toHaveBeenCalledWith('/lists/subscriptions', [
        {
          list_id: 'everybody',
          email: 'foo@zaius.com',
          subscribed: true
        },
        {
          list_id: 'everybody',
          email: 'bar@zaius.com',
          phone: '+15555550000',
          subscribed: true
        }
      ]);
      postFn.mockRestore();
    });
  });

  describe('unsubscribe', () => {
    it('unsubscribes a user to a list', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      await unsubscribe('everybody', {email: 'foo@zaius.com'});
      expect(postFn).toHaveBeenCalledWith('/lists/subscriptions', [
        {
          list_id: 'everybody',
          email: 'foo@zaius.com',
          subscribed: false
        }
      ]);
      postFn.mockRestore();
    });

    it('unsubscribes multiple users to a list', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      await unsubscribe('everybody', [{email: 'foo@zaius.com'}, {email: 'bar@zaius.com', phone: '+15555550000'}]);
      expect(postFn).toHaveBeenCalledWith('/lists/subscriptions', [
        {
          list_id: 'everybody',
          email: 'foo@zaius.com',
          subscribed: false
        },
        {
          list_id: 'everybody',
          email: 'bar@zaius.com',
          phone: '+15555550000',
          subscribed: false
        }
      ]);
      postFn.mockRestore();
    });
  });

  describe('updateSubscriptions', () => {
    it('updates multiple subscriptions', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      await updateSubscriptions('everybody', [
        {email: 'foo@zaius.com', list_id: 'foo_only', subscribed: true},
        {email: 'bar@zaius.com', phone: '+15555550000', subscribed: false}
      ]);
      expect(postFn).toHaveBeenCalledWith('/lists/subscriptions', [
        {
          list_id: 'foo',
          email: 'foo@zaius.com',
          subscribed: true
        },
        {
          list_id: 'everybody',
          email: 'bar@zaius.com',
          phone: '+15555550000',
          subscribed: false
        }
      ]);
    });

    it('throws an error if the batch limit is exceeded', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      const updates = Array(101).fill({
        list_id: 'nobody',
        email: 'foo@zaius.com',
        subscribed: false
      } as ListUpdateRequest);
      await expect(updateSubscriptions('everybody', updates)).rejects.toThrowError(ApiV3.ErrorCode.BatchLimitExceeded);
      postFn.mockRestore();
    });

    it('throws an error if the api returns an error', async () => {
      const postFn = jest
        .spyOn(ApiV3, 'post')
        .mockRejectedValueOnce(new ApiV3.HttpError('Bad Request', undefined, {} as any));
      await expect(
        updateSubscriptions('foo', [
          {
            list_id: 'nobody',
            email: 'foo@zaius.com',
            subscribed: false
          }
        ])
      ).rejects.toThrowError('Bad Request');
      postFn.mockRestore();
    });
  });
});
