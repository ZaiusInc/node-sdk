import {ApiV3} from '../lib/ApiV3';
import {RequestInterceptor} from './RequestInterceptor';

export interface Config {
  /**
   * The public or private API key for making v3 API requests.
   * The public API key is usually the Zaius tracker ID for the account.
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
const DEFAULT_CONFIG: InternalConfig = Object.freeze({
  apiBasePath: process.env['ZAIUS_SDK_API_BASE_PATH'] || 'https://api.zaius.com/v3/',
  requestId: process.env['ZAIUS_SDK_TEST_REQUEST_ID'],
  apiKey: process.env['ZAIUS_SDK_API_KEY'] || ''
});

/**
 * @hidden
 */
let configuration: InternalConfig = DEFAULT_CONFIG;

/**
 * Exposed method to set the configuration options
 * This handled automatically in a Zaius Integration Platform App
 * usage z.configure({...})
 *
 * @param newConfig the configuration to use going forward or null to restore defaults
 */
export function configure(newConfig: Config | InternalConfig | null) {
  if (newConfig == null) {
    configuration = DEFAULT_CONFIG;
  } else {
    configuration = Object.assign({}, DEFAULT_CONFIG, configuration, newConfig);
  }

  ApiV3.configure(configuration);
}
