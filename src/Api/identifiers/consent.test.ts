import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {ConsentUpdate} from '../Types';
import {getConsent, updateConsent} from './consent';

const mockConfiguration: InternalConfig = {
  trackerId: 'vdl',
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key'
};

describe('consent', () => {
  describe('updateConsent', () => {
    beforeAll(() => {
      ApiV3.configure(mockConfiguration);
    });

    it('sends a post to /consent', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      const update: ConsentUpdate = Object.freeze({
        consent: false,
        consent_update_reason: 'preference center update'
      });
      await updateConsent('email', 'foo@zaius.com', update);
      expect(postFn).toHaveBeenCalledWith('/consent', {
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
      const update: ConsentUpdate = {
        consent: false
      };
      await expect(updateConsent('email', 'foo@zaius.com', update)).rejects.toThrowError('Bad Request');
      postFn.mockRestore();
    });

    it('formats date if provided as a Date object', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce('2020-01-21T23:07:54.373Z');
      const update: ConsentUpdate = Object.freeze({
        consent: false,
        consent_update_reason: 'preference center update',
        consent_update_ts: new Date()
      });
      await updateConsent('email', 'foo@zaius.com', update);
      expect(postFn).toHaveBeenCalledWith('/consent', {
        ...update,
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        consent_update_ts: '2020-01-21T23:07:54.373Z'
      });
      postFn.mockRestore();
    });
  });

  describe('getConsent', () => {
    it('sends a get to /consent/{identifier}', async () => {
      const getFn = jest.spyOn(ApiV3, 'get').mockResolvedValueOnce({} as any);
      await getConsent('email', 'foo@zaius.com');
      expect(getFn).toHaveBeenCalledWith('/consent/email?id=foo%40zaius.com');
      getFn.mockRestore();
    });

    it('safely encodes url values', async () => {
      const getFn = jest.spyOn(ApiV3, 'get').mockResolvedValueOnce({} as any);
      await getConsent('em ail', '"foo"@zaius.com');
      expect(getFn).toHaveBeenCalledWith('/consent/em%20ail?id=%22foo%22%40zaius.com');
      getFn.mockRestore();
    });
  });
});
