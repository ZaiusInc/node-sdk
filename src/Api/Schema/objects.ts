import {ApiV3} from '../lib/ApiV3';
import {ObjectDefinition} from '../Types';
import {ApiObjectExistsError} from './ApiObjectExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {checkInvalids} from './checkInvalids';
import V3InvalidSchemaDetail = ApiV3.V3InvalidSchemaDetail;

/**
 * Create a custom Zaius object
 * @param object the object to create
 * @throws {ApiObjectExistsError} if the object name already exists
 * @throws {HttpError} if it receives any other non-2XX result
 */
export async function createObject(object: ObjectDefinition): Promise<ApiV3.HttpResponse<ObjectDefinition>> {
  validateCreateObject(object);

  try {
    return await ApiV3.post(`/schema/objects`, object);
  } catch (e) {
    if (e instanceof ApiV3.HttpError && e.response) {
      const invalids: V3InvalidSchemaDetail[] | undefined =
        e.response.data && e.response.data.detail && e.response.data.detail.invalids as V3InvalidSchemaDetail[];
      if (checkInvalids(invalids, 'name', (reason) => /^already used/.test(reason))) {
        throw new ApiObjectExistsError(e);
      }
    }
    throw e;
  }
}

/**
 * @hidden
 * Temporary validation until we update milton
 */
function validateCreateObject(object: ObjectDefinition) {
  const context = ApiV3.getAppContext();
  if (context && context.app_id) {
    const prefix = `${context.app_id}_`;
    if (!object.name.startsWith(prefix)) {
      throw new ApiSchemaValidationError(`object name ${object.name} must be prefixed with ${prefix}`);
    }
    if (object.alias && !object.alias.startsWith(prefix)) {
      throw new ApiSchemaValidationError(`object alias ${object.name} must be prefixed with ${prefix}`);
    }
    if (!object.display_name.startsWith(context.display_name)) {
      throw new ApiSchemaValidationError(
        `object display name ${object.display_name} must be prefixed with ${context.display_name}`
      );
    }
  }
}
