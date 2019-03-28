import {event} from './Events/event';
import {config, configure} from './lib';
import * as _Zaius from './Types';

export const z = {
  configure,
  config,
  event
};

export import Zaius = _Zaius;
