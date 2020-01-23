import {ApiV3} from '../lib/ApiV3';
import {ObjectDefinition} from '../Types';
import {ApiObjectExistsError} from './ApiObjectExistsError';
import {ApiObjectNotFoundError} from './ApiObjectNotFoundError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {invalidsContain} from './invalidsContain';
import V3InvalidSchemaDetail = ApiV3.V3InvalidSchemaDetail;

/**
 * Gets the definition of a Zaius object.
 * @param name the object name
 * @throws {ApiObjectNotFoundError} if there is no object with the given name
 * @throws {HttpError} if it receives any other non-2XX result
 */
export async function getObject(name: string): Promise<ApiV3.HttpResponse<ObjectDefinition>> {
  try {
    return await ApiV3.get(`/schema/objects/${name}`);
  } catch (e) {
    if (e instanceof ApiV3.HttpError && e.response && e.response.status === 404) {
      throw new ApiObjectNotFoundError(e);
    }
    throw e;
  }
}

/**
 * Gets the definitions of all Zaius objects.
 * @throws {HttpError} if it receives a non-2XX result
 */
export async function getAllObjects(): Promise<ApiV3.HttpResponse<ObjectDefinition[]>> {
  return await ApiV3.get('/schema/objects');
}

/**
 * Create a custom Zaius object
 * @param object the object to create
 * @throws {ApiObjectExistsError} if the object name already exists
 * @throws {HttpError} if it receives any other non-2XX result
 */
export async function createObject(object: ObjectDefinition): Promise<ApiV3.HttpResponse<ObjectDefinition>> {
  validateCreateObject(object);

  try {
    return await ApiV3.post('/schema/objects', object);
  } catch (e) {
    if (e instanceof ApiV3.HttpError && e.response) {
      const invalids: V3InvalidSchemaDetail[] | undefined =
        e.response.data && e.response.data.detail && (e.response.data.detail.invalids as V3InvalidSchemaDetail[]);
      if (invalidsContain(invalids, 'name', (reason) => /^already used/.test(reason))) {
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
