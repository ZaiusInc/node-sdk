import * as Request from './Request';
import {KeyValueStore, SecretStore} from './Store';

export namespace Zap {
  export import Lifecycle = Request.Lifecycle;
  export import Function = Request.Function;
  export import Job = Request.Job;

  export const store = new KeyValueStore();
  export const secrets = new SecretStore();
}
