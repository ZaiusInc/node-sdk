import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {ReachabilityUpdate} from '../Types';
import {getReachability, updateReachability} from './reachability';

const mockConfiguration: InternalConfig = {
  trackerId: 'vdl',
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key'
};

describe('reachability', () => {
  describe('updateReachability', () => {
    beforeAll(() => {
      ApiV3.configure(mockConfiguration);
    });

    it('sends a post to /reachability', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      const update: ReachabilityUpdate = Object.freeze({
        reachable: false,
        reachable_update_reason: 'hard_bounce'
      });
      await updateReachability('email', 'foo@zaius.com', update);
      expect(postFn).toHaveBeenCalledWith('/reachability', {
        ...update,
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com'
      });
      postFn.mockRestore();
    });

    it('throws an error if the api returns an error', async () => {
      const postFn = jest
        .spyOn(ApiV3, 'post')
        .mockRejectedValueOnce(new ApiV3.HttpError('Bad Request', undefined, {} as any));
      const update: ReachabilityUpdate = {
        reachable: false
      };
      await expect(updateReachability('email', 'foo@zaius.com', update)).rejects.toThrowError('Bad Request');
      postFn.mockRestore();
    });

    it('formats date if provided as a Date object', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce('2020-01-21T23:07:54.373Z');
      const update: ReachabilityUpdate = Object.freeze({
        reachable: false,
        reachable_update_reason: 'hard_bounce',
        reachable_update_ts: new Date()
      });
      await updateReachability('email', 'foo@zaius.com', update);
      expect(postFn).toHaveBeenCalledWith('/reachability', {
        ...update,
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        reachable_update_ts: '2020-01-21T23:07:54.373Z'
      });
      postFn.mockRestore();
    });
  });

  describe('getReachability', () => {
    it('sends a get to /reachability/{identifier}', async () => {
      const getFn = jest.spyOn(ApiV3, 'get').mockResolvedValueOnce({} as any);
      await getReachability('email', 'foo@zaius.com');
      expect(getFn).toHaveBeenCalledWith('/reachability/email?id=foo%40zaius.com');
      getFn.mockRestore();
    });

    it('safely encodes url values', async () => {
      const getFn = jest.spyOn(ApiV3, 'get').mockResolvedValueOnce({} as any);
      await getReachability('em ail', '"foo"@zaius.com');
      expect(getFn).toHaveBeenCalledWith('/reachability/em%20ail?id=%22foo%22%40zaius.com');
      getFn.mockRestore();
    });
  });
});
