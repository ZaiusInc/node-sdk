import {RequestInterceptor} from './RequestInterceptor';

export interface Config {
  /**
   * The public or private API key for making v3 API requests.
   * The public API key is usually the ODP tracker ID for the account.
   * If you need to make calls to private APIs, this must be a private API key.
   */
  apiKey: string;

  /* eslint-disable max-len */
  /**
   * The base path for the API.
   * The value depends on the region of the ODP account.
   * The current list of supported regions can be find in [the ODP documentation](https://docs.developers.optimizely.com/optimizely-data-platform/reference/introduction#rest-api).
   *
   * The SDK tries to determine the base path from the API key, but you can override it by setting this value.
   */
  apiBasePath?: string;
}

/**
 * @hidden
 */
export interface InternalConfig extends Config {
  apiBasePath: string;
  apiKey: string;
  requestInterceptor?: RequestInterceptor;
  appContext?: AppContext;
}

/**
 * @hidden
 * preferably removed when no longer needed
 */
export interface AppContext {
  app_id: string;
  display_name: string;
  version: string;
  vendor: string;
}

function getApiBasePath(apiKey: string | null, apiBasePath?: string): string {
  if (apiBasePath) {
    return apiBasePath;
  }
  let path: string;
  if (apiKey) {
    let publicKey: string = apiKey;
    if (publicKey.includes('.')) {
      publicKey = publicKey.substring(0, publicKey.lastIndexOf('.'));
    }

    if (publicKey.endsWith('-eu1')) {
      path = 'https://api.eu1.odp.optimizely.com/v3/';
    } else if (publicKey.endsWith('-au1')) {
      path = 'https://api.au1.odp.optimizely.com/v3/';
    } else {
      path = 'https://api.zaius.com/v3/';
    }
  } else {
    path = 'https://api.zaius.com/v3/';
  }

  return path;
}

/**
 * @hidden
 */
const DEFAULT_CONFIG: Config = Object.freeze({
  apiKey:  process.env['ODP_SDK_API_KEY'] || process.env['ZAIUS_SDK_API_KEY'] || '',
  apiBasePath: getApiBasePath(process.env['ODP_SDK_API_KEY'] || process.env['ZAIUS_SDK_API_KEY'] || null)
});

/**
 * @hidden
 *
 * @param newConfig the configuration to use going forward or null to restore defaults
 */
export function configOrDefault(newConfig: Config | InternalConfig | null): InternalConfig {
  const apiBasePath = getApiBasePath(
    (newConfig && newConfig.apiKey) || null,
    (newConfig && newConfig.apiBasePath) || undefined
  );
  let configuration: InternalConfig;
  if (newConfig == null) {
    configuration = Object.assign({}, DEFAULT_CONFIG, {apiBasePath});
  } else {
    configuration = Object.assign({}, DEFAULT_CONFIG, {apiBasePath}, newConfig);
  }

  return configuration;
}

/**
 * @hidden
 */
let moduleScopedConfig: InternalConfig | null;

/**
 * @hidden
 *
 */
export function getModuleOrGlobalConfig(): InternalConfig {
  const asyncLocalStorage = global.ocpContextStorage && global.ocpContextStorage.getStore();
  if (asyncLocalStorage) {
    return asyncLocalStorage.odpNodeSdkConfig;
  } else if (moduleScopedConfig != null) {
    return moduleScopedConfig;
  } else {
    return configOrDefault(null);
  }
}

/**
 * @hidden
 *
 * @param newConfig the configuration to use going forward or null to restore defaults
 */
export function setModuleScopedConfig(config: Config | InternalConfig | null): void {
  if (process.env['ODP_SDK_API_DISABLE_MODULE_SCOPE_CONFIG']) {
    throw new Error('Module scoped configuration is disabled');
  }

  moduleScopedConfig = configOrDefault(config);
}

/**
 * @hidden
 *
 * Clears the module scoped configuration
 */
export function clearModuleScopedConfig(): void {
  moduleScopedConfig = null;
}
