import {ApiV3} from '../lib/ApiV3';
import {ModulesResponse} from '../Types';
import {ApiModuleAlreadyEnabledError} from './ApiModuleAlreadyEnabledError';
import {invalidsContain} from './invalidsContain';
import V3InvalidSchemaDetail = ApiV3.V3InvalidSchemaDetail;

/**
 * Gets the list of enabled schema modules.
 * @param apiV3 the v3 API instance to use
 * @throws {HttpError} if it receives a non-2XX result
 */
export async function getEnabledModules(apiV3: ApiV3.API): Promise<ApiV3.HttpResponse<ModulesResponse>> {
  return await apiV3.get('/schema/modules');
}

/**
 * Enables a schema module.
 * @param apiV3 the v3 API instance to use
 * @param module the module to enable
 * @throws {ApiModuleAlreadyEnabledError} if the module was already enabled
 * @throws {HttpError} if it receives any other non-2XX result
 */
export async function enableModule(apiV3: ApiV3.API, module: string): Promise<ApiV3.HttpResponse<ModulesResponse>> {
  try {
    return await apiV3.post('/schema/modules', {module});
  } catch (e) {
    if (e instanceof ApiV3.HttpError && e.response) {
      const invalids: V3InvalidSchemaDetail[] | undefined =
        e.response.data && e.response.data.detail && (e.response.data.detail.invalids as V3InvalidSchemaDetail[]);
      if (invalidsContain(invalids, 'module', (reason) => reason === 'already enabled')) {
        throw new ApiModuleAlreadyEnabledError(e);
      }
    }
    throw e;
  }
}
