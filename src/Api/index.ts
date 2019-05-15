import {config, configure} from './config';
import {event} from './Events/event';
import * as Zaius from './Types';

/**
 * The preferred export for utilizing the Zaius Node SDK.
 * @usage `import {z} from '@zaius/node-sdk';`
 */
export const z = {
  /**
   * Configure the Zaius SDK for use
   */
  configure,
  /**
   * Access public values of the current configuration
   */
  config,
  /**
   * Send an event to Zaius using the v3 event API
   */
  event
};

export {Zaius};
