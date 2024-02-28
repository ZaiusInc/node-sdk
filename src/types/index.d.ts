import {InternalConfig} from '../Api/config/configure';
import {AsyncLocalStorage} from 'async_hooks';

export interface OCPContext {
  odpNodeSdkConfig: InternalConfig;
}

declare global {
  /* eslint-disable no-var */
  var ocpContextStorage: AsyncLocalStorage<OCPContext> | null;
}
