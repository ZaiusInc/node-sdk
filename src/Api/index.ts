import * as Zaius from './Types';
import * as ODP from './Types';
import {Config, InternalConfig, setModuleScopedConfig} from './config/configure';
import {ODPClient} from './ODPClient';

/**
 * An extension of ODPClient that allows changing the configuration after the client has been created.
 * The purpose of this class is to allow managing module scoped instance of OCPClient.
 */
export class ReconfigurableODPClient extends ODPClient {

  /**
   * Configure the ODP SDK for use
   *
   */
  public configure(config: Config | InternalConfig | null): void {
    setModuleScopedConfig(config);
  }
}

export {ODPClient};

/**
 * Module scoped way of utilizing the ODP Node SDK.
 * @usage
 * ```
 *
 * import {odp} from '@zaiusinc/node-sdk';
 *
 * // Send an event to ODP
 * await odp.event(...);
 * // Subscribe a customer by an identifier to a list
 * await odp.list.subscribe(...);
 * // etc
 * ```
 */
export const odp = new ReconfigurableODPClient();
export {ODP};

/**
 * For backward compatibility
 */
export const z = odp;
export {Zaius};
