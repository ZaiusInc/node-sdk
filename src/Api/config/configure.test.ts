import 'jest';
import {
  clearModuleScopedConfig,
  configOrDefault,
  getModuleOrGlobalConfig,
  InternalConfig,
  setModuleScopedConfig
} from './configure';
import {AsyncLocalStorage} from 'async_hooks';
import {OCPContext} from '../../types';

jest.mock('../lib/ApiV3');

describe('configure', () => {

  function runWithAsyncLocalStore(
    code: () => void,
    internalConfig: InternalConfig
  ) {
    const store = new AsyncLocalStorage<OCPContext>();
    global.ocpContextStorage = store;

    const context = {
      odpNodeSdkConfig: internalConfig
    } as OCPContext;

    store.run(context, code);
  }

  it('merges default config with provided config', () => {
    const configuration = {
      apiBasePath: 'https://api.zaius.com/v3/',
      apiKey: 'pub_api_key'
    };

    // set by setup.ts
    const defaultConfig = {
      apiKey: 'private.api_key'
    };
    expect(configOrDefault(configuration)).toEqual(Object.assign(defaultConfig, configuration));
  });

  it('deducts apiBasePath from API key', () => {
    expect(
      configOrDefault({
        apiKey: 'public.secret-part'
      }).apiBasePath
    ).toEqual('https://api.zaius.com/v3/');

    expect(
      configOrDefault({
        apiKey: 'public-eu1.secret-part'
      }).apiBasePath
    ).toEqual('https://api.eu1.odp.optimizely.com/v3/');

    expect(
      configOrDefault({
        apiKey: 'public-au1.secret-part'
      }).apiBasePath
    ).toEqual('https://api.au1.odp.optimizely.com/v3/');
  });

  describe('getModuleOrGlobalConfig', () => {
    beforeEach(() => {
      clearModuleScopedConfig();
      global.ocpContextStorage = null;
    });

    it('returns async local storage config defined', () => {
      runWithAsyncLocalStore(() => {
        expect(getModuleOrGlobalConfig().apiKey).toEqual('async-store-scoped-api-key');
      }, {
        apiKey: 'async-store-scoped-api-key'
      } as InternalConfig);
    });

    it('returns module scoped config if defined and async local storage not defined', () => {
      setModuleScopedConfig({
        apiKey: 'module-scoped-api-key'
      });
      expect(getModuleOrGlobalConfig().apiKey).toEqual('module-scoped-api-key');
    });

    it('falls back to the default config if no other defined', () => {
      expect(getModuleOrGlobalConfig().apiKey).toEqual('private.api_key');
    });
  });
});
