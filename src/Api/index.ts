import {config, configure} from './config';
import {customer} from './Customers/customer';
import {event} from './Events/event';
import {object} from './Objects/object';
import * as schema from './Schema';
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
  event,
  /**
   * Create or Update a customer profile in Zaius using the v3 profiles API
   */
  customer,
  /**
   * Create or Update an object in Zaius using the v3 objects API
   */
  object,
  /**
   * Manage schema (Zaius domain objects and fields) using the v3 APIs
   */
  schema
};

export {Zaius};
