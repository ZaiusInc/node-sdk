import {ApiV3} from '../lib/ApiV3';
import {ModulesResponse} from '../Types';
import {ApiModuleAlreadyEnabledError} from './ApiModuleAlreadyEnabledError';
import {checkInvalids} from './checkInvalids';
import V3InvalidSchemaDetail = ApiV3.V3InvalidSchemaDetail;

/**
 * Gets the list of enabled schema modules.
 * @throws {HttpError} if it receives a non-2XX result
 */
export async function getEnabledModules(): Promise<ApiV3.HttpResponse<ModulesResponse>> {
  return await ApiV3.get('/schema/modules');
}

/**
 * Enables a schema module.
 * @param module the module to enable
 * @throws {ApiModuleAlreadyEnabledError} if the module was already enabled
 * @throws {HttpError} if it receives any other non-2XX result
 */
export async function enableModule(module: string): Promise<ApiV3.HttpResponse<ModulesResponse>> {
  try {
    return await ApiV3.post('/schema/modules', {module});
  } catch (e) {
    if (e instanceof ApiV3.HttpError && e.response) {
      const invalids: V3InvalidSchemaDetail[] | undefined =
        e.response.data && e.response.data.detail && e.response.data.detail.invalids as V3InvalidSchemaDetail[];
      if (checkInvalids(invalids, 'module', (reason) => reason === 'already enabled')) {
        throw new ApiModuleAlreadyEnabledError(e);
      }
    }
    throw e;
  }
}
