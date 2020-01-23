import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {getMetadata, updateMetadata} from './identifiers';

const mockConfiguration: InternalConfig = {
  trackerId: 'vdl',
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key'
};

describe('identifiers', () => {
  beforeAll(() => {
    ApiV3.configure(mockConfiguration);
  });

  describe('updateMetadata', () => {
    it('sends a post to /identifiers', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      await updateMetadata('email', 'foo@zaius.com', {foo: 'bar'});
      expect(postFn).toHaveBeenCalledWith('/identifiers', {
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        metadata: {
          foo: 'bar'
        }
      });
      postFn.mockRestore();
    });
  });

  describe('getMetadata', () => {
    it('sends a get to /identifiers/{identifier}?id={value}', async () => {
      const getFn = jest.spyOn(ApiV3, 'get').mockResolvedValueOnce({} as any);
      await getMetadata('email', 'foo@zaius.com');
      expect(getFn).toHaveBeenCalledWith('/identifiers/email?id=foo%40zaius.com');
      getFn.mockRestore();
    });

    it('encodes values properly into the URL', async () => {
      const getFn = jest.spyOn(ApiV3, 'get').mockResolvedValueOnce({} as any);
      await getMetadata('em ail', '"foo"@zaius.com');
      expect(getFn).toHaveBeenCalledWith('/identifiers/em%20ail?id=%22foo%22%40zaius.com');
      getFn.mockRestore();
    });
  });
});
