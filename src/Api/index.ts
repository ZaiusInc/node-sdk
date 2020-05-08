import {configure} from './config';
import {customer} from './Customers/customer';
import {event} from './Events/event';
import {identifier} from './Identifiers';
import {ApiV3} from './lib/ApiV3';
import {list} from './List';
import {object} from './Objects/object';
import {schema} from './Schema';
import * as Zaius from './Types';

/**
 * The preferred export for utilizing the Zaius Node SDK.
 * @usage
 * ```
 *
 * import {z} from '@zaiusinc/node-sdk';
 *
 * // Send an event to Zaius
 * await z.event(...);
 * // Subscribe a customer by an identifier to a list
 * await z.list.subscribe(...);
 * // etc
 * ```
 */
export const z = {
  /**
   * Configure the Zaius SDK for use
   */
  configure,
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
  schema,
  /**
   * Manage customer identifiers using the v3 APIs
   */
  identifier,
  /**
   * Manage list subscriptions using the v3 APIs
   */
  list,
  /**
   * Direct access to query any API by path using the v3 API helper
   */
  v3Api: ApiV3
};

export {Zaius};
