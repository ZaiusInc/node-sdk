import {Config} from '@zaiusinc/node-sdk/dist/Api/config';
import {InternalConfig} from '../Api/config/configure';

declare global {
  /* eslint-disable no-var */
  var odpNodeSdkConfig: Config | InternalConfig | null;
}
