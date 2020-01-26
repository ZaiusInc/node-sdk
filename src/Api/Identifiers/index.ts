import {getConsent, updateConsent} from './consent';
import {getMetadata, updateMetadata} from './identifiers';
import {getReachability, updateReachability} from './reachability';

export const identifier = {
  getMetadata,
  updateMetadata,
  getReachability,
  updateReachability,
  getConsent,
  updateConsent
};
