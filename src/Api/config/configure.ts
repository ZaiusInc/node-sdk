import {ApiV3} from '../lib/ApiV3';

export interface Config {
  /**
   * The public API key for making v3 API requests.
   * Usually the Zaius tracker ID for the account
   */
  publicApiKey: string;
  /**
   * The private API key for making v3 API requests.
   */
  privateApiKey?: string;
  /**
   * A request ID to be added to all logging
   */
  requestId?: string;
}

/**
 * @hidden
 */
export interface InternalConfig extends Config {
  trackerId: string;
  apiBasePath: string;
  publicApiKey: string;
  privateApiKey?: string;
  requestId?: string;
}

/**
 * @hidden
 */
const DEFAULT_CONFIG: InternalConfig = Object.freeze({
  trackerId: process.env['ZAIUS_SDK_TRACKER_ID'] || 'unknown',
  apiBasePath: process.env['ZAIUS_SDK_API_BASE_PATH'] || 'https://api.zaius.com/v3/',
  requestId: process.env['ZAIUS_SDK_TEST_REQUEST_ID'],
  publicApiKey: process.env['ZAIUS_SDK_TRACKER_ID'] || 'unknown',
  privateApiKey: process.env['ZAIUS_SDK_PRIVATE_API_KEY']
});

/**
 * @hidden
 */
let configuration: InternalConfig = DEFAULT_CONFIG;

/**
 * Exposed method to set the configuration options
 * This handled automatically in a Zap
 * usage z.configure({...})
 * @param newConfig the configuration to use going forward or null to restore defaults
 */
export function configure(newConfig: Config | InternalConfig | null) {
  if (newConfig == null) {
    configuration = DEFAULT_CONFIG;
  } else {
    configuration = Object.assign({}, DEFAULT_CONFIG, newConfig);
  }

  ApiV3.configure(configuration);
}

/**
 * A wrapper around the public SDK configuration values
 */
export class PublicConfig {
  /**
   * @returns Tracker ID, your Zaius account identifier used for collecting data and accessing APIs
   */
  public get trackerId(): string {
    return configuration.trackerId;
  }
}

/**
 * Read access to the public values of the current configuration
 */
export const config = new PublicConfig();
