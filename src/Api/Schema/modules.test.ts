import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {ApiModuleAlreadyEnabledError} from './ApiModuleAlreadyEnabledError';
import {enableModule, getEnabledModules} from './modules';

const mockConfiguration: InternalConfig = {
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key'
};

const mockAppConfiguration: InternalConfig = {
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key',
  appContext: {
    app_id: 'test',
    display_name: 'Test App',
    version: '1.0.0',
    vendor: 'zaius'
  }
};

describe('modules', () => {
  describe('getEnabledModules', () => {
    beforeAll(() => {
      ApiV3.configure(mockConfiguration);
    });

    it('sends a get to /schema/modules', async () => {
      const getFn = jest.spyOn(ApiV3, 'get').mockResolvedValueOnce({} as any);
      await getEnabledModules();
      expect(getFn).toHaveBeenCalledWith('/schema/modules');
      getFn.mockRestore();
    });

    it('throws an error if the api returns an error', async () => {
      const getFn = jest
        .spyOn(ApiV3, 'get')
        .mockRejectedValueOnce(new ApiV3.HttpError("I'm a teapot", undefined, {} as any));
      await expect(getEnabledModules()).rejects.toThrowError("I'm a teapot");
      getFn.mockRestore();
    });
  });

  describe('enableModule', () => {
    beforeAll(() => {
      ApiV3.configure(mockAppConfiguration);
    });

    it('sends a post to /schema/modules', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      await enableModule('foo');
      expect(postFn).toHaveBeenCalledWith('/schema/modules', {module: 'foo'});
      postFn.mockRestore();
    });

    it('throws an error if the api returns an error', async () => {
      const postFn = jest
        .spyOn(ApiV3, 'post')
        .mockRejectedValueOnce(new ApiV3.HttpError('Bad Request', undefined, {} as any));
      await expect(enableModule('foo')).rejects.toThrowError('Bad Request');
      postFn.mockRestore();
    });

    it('throws an already enabled error if the module is already enabled', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockRejectedValueOnce(
        new ApiV3.HttpError('Bad Request', undefined, {
          data: {
            detail: {
              invalids: [
                {
                  field: 'module',
                  reason: 'already enabled'
                }
              ]
            }
          }
        } as any)
      );
      await expect(enableModule('foo')).rejects.toThrowError(ApiModuleAlreadyEnabledError);
      postFn.mockRestore();
    });
  });
});
