import {ApiV3} from './lib/ApiV3';
import * as Zaius from './Types';
import * as ODP from './Types';
import {Config, configOrDefault, InternalConfig} from './config/configure';
import {ODPClient} from './ODPClient';

/**
 * An extension of ODPClient that allows changing the configuration after the client has been created.
 * The purpose of this class is to allow managing module scoped instance of OCPClient.
 */
export class ModuleScopedODPClient extends ODPClient {

  /**
   * Configure the ODP SDK for use
   *
   */
  public configure(newConfig: Config | InternalConfig | null): void {
    this.v3Api = new ApiV3.API(configOrDefault(newConfig));
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
export const odp = new ModuleScopedODPClient();
export {ODP};

/**
 * For backward compatibility
 */
export const z = odp;
export {Zaius};
