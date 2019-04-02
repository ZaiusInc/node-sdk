import {ApiV3} from './ApiV3';

export interface ApiConfig {
  trackerId: string;
  apiBasePath: string;
  publicApiKey: string;
  privateApiKey?: string;
  requestId?: string;
}

interface Config extends ApiConfig {
  trackerId: string;
}

const DEFAULT_CONFIG: Config = Object.freeze({
  trackerId: process.env['ZAIUS_SDK_TRACKER_ID'] || 'unknown',
  apiBasePath: process.env['ZAIUS_SDK_API_BASE_PATH'] || 'https://api.zaius.com/v3/',
  requestId: process.env['ZAIUS_SDK_TEST_REQUEST_ID'],
  publicApiKey: process.env['ZAIUS_SDK_TRACKER_ID'] || 'unknown',
  privateApiKey: process.env['ZAIUS_SDK_PRIVATE_API_KEY']
});

let configuration: Config = DEFAULT_CONFIG;

/**
 * Exposed method to set the configuration options
 * This handled automatically in a Zap
 * usage z.configure({...})
 * @param newConfig the configuration to use going forward or null to restore defaults
 */
export function configure(newConfig: Config | null) {
  if (newConfig == null) {
    configuration = DEFAULT_CONFIG;
  } else {
    configuration = newConfig;
  }

  ApiV3.configure(configuration);
}

/**
 * A wrapper around the public SDK configuration values
 */
export class ConfigWrapper {
  /**
   * @returns Tracker ID, your Zaius account identifier used for collecting data and accessing APIs
   */
  public get trackerId(): string {
    return configuration.trackerId;
  }
}

export const config = new ConfigWrapper();
