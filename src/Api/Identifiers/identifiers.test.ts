import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {getMetadata, updateMetadata} from './identifiers';

const mockConfiguration: InternalConfig = {
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key'
};

let apiV3: ApiV3.API;
describe('identifiers', () => {
  beforeAll(() => {
    apiV3 = new ApiV3.API(mockConfiguration);
  });

  describe('updateMetadata', () => {
    it('sends a post to /identifiers', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      await updateMetadata(
        apiV3,
        {identifier_field_name: 'email', identifier_value: 'foo@optimizely.com', metadata: {foo: 'bar'}}
      );
      expect(postFn).toHaveBeenCalledWith('/identifiers', [
        {
          identifier_field_name: 'email',
          identifier_value: 'foo@optimizely.com',
          metadata: {
            foo: 'bar'
          }
        }
      ]);
      postFn.mockRestore();
    });

    it('sends a batch to /identifiers', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      await updateMetadata(apiV3, [
        {identifier_field_name: 'email', identifier_value: 'foo@optimizely.com', metadata: {foo: 'foo'}},
        {identifier_field_name: 'email', identifier_value: 'bar@optimizely.com', metadata: {foo: 'bar'}}
      ]);
      expect(postFn).toHaveBeenCalledWith('/identifiers', [
        {
          identifier_field_name: 'email',
          identifier_value: 'foo@optimizely.com',
          metadata: {
            foo: 'foo'
          }
        },
        {
          identifier_field_name: 'email',
          identifier_value: 'bar@optimizely.com',
          metadata: {
            foo: 'bar'
          }
        }
      ]);
      postFn.mockRestore();
    });

    it('throws an error if the batch is too large', async () => {
      const updates = Array(101).fill({
        identifier_field_name: 'email',
        identifier_value: 'foo@optimizely.com',
        metadata: {foo: 'foo'}
      });
      await expect(updateMetadata(apiV3, updates)).rejects.toThrowError('maximum batch size');
    });
  });

  describe('getMetadata', () => {
    it('sends a get to /identifiers/{identifier}?id={value}', async () => {
      const getFn = jest.spyOn(apiV3, 'get').mockResolvedValueOnce({} as any);
      await getMetadata(apiV3, 'email', 'foo@optimizely.com');
      expect(getFn).toHaveBeenCalledWith('/identifiers/email?id=foo%40optimizely.com');
      getFn.mockRestore();
    });

    it('encodes values properly into the URL', async () => {
      const getFn = jest.spyOn(apiV3, 'get').mockResolvedValueOnce({} as any);
      await getMetadata(apiV3, 'em ail', '"foo"@optimizely.com');
      expect(getFn).toHaveBeenCalledWith('/identifiers/em%20ail?id=%22foo%22%40optimizely.com');
      getFn.mockRestore();
    });
  });
});
