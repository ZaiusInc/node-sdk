import {RequestInterceptor} from './RequestInterceptor';

export interface Config {
  /**
   * The public or private API key for making v3 API requests.
   * The public API key is usually the ODP tracker ID for the account.
   * If you need to make calls to private APIs, this must be a private API key.
   */
  apiKey: string;
  /**
   * A request ID to be added to all logging.
   */
  requestId?: string;
}

/**
 * @hidden
 */
export interface InternalConfig extends Config {
  apiBasePath: string;
  apiKey: string;
  requestId?: string;
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

/**
 * @hidden
 */
const DEFAULT_CONFIG = Object.freeze({
  requestId: process.env['ODP_SDK_TEST_REQUEST_ID'] || process.env['ZAIUS_SDK_TEST_REQUEST_ID'],
  apiKey:  process.env['ODP_SDK_API_KEY'] || process.env['ZAIUS_SDK_API_KEY'] || ''
});

/**
 * Exposed method to set the configuration options
 * This handled automatically in an Optimizely Connect Platform App
 *
 * Usage odp.configure({...})
 *
 * @param newConfig the configuration to use going forward or null to restore defaults
 */
export function configOrDefault(newConfig: Config | InternalConfig | null): InternalConfig {
  let apiBasePath = 'https://api.zaius.com/v3/';
  if (newConfig && newConfig.apiKey) {
    let publicKey: string = newConfig.apiKey;
    if (publicKey.includes('.')) {
      publicKey = publicKey.substring(0, publicKey.lastIndexOf('.'));
    }

    if (publicKey.endsWith('-eu1')) {
      apiBasePath = 'https://api.eu1.odp.optimizely.com/v3/';
    } else if (publicKey.endsWith('-au1')) {
      apiBasePath = 'https://api.au1.odp.optimizely.com/v3/';
    }
  }

  let configuration: InternalConfig;
  if (newConfig == null) {
    configuration = Object.assign({}, DEFAULT_CONFIG, {apiBasePath});
  } else {
    configuration = Object.assign({}, DEFAULT_CONFIG, {apiBasePath}, newConfig);
  }

  return configuration;
}
