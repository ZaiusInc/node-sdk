import {ApiV3} from '../lib/ApiV3';
import {FieldDefinition} from '../Types';
import {ApiFieldExistsError} from './ApiFieldExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {invalidsContain} from './invalidsContain';
import V3InvalidSchemaDetail = ApiV3.V3InvalidSchemaDetail;
import {AppContext} from '../config/configure';

/**
 * Create a custom field on an ODP object
 * @param apiV3 the v3 API instance to use
 * @param object the ODP object to create the field on, e.g., `customers`
 * @param field the field to create
 * @throws {ApiFieldExistsError} if the field name already exists
 * @throws {HttpError} if it receives any other non-2XX result
 */
export async function createField(
  apiV3: ApiV3.API,
  object: string,
  field: FieldDefinition
): Promise<ApiV3.HttpResponse<FieldDefinition>> {
  validateCreateField(object, field, apiV3.getContext());

  try {
    return await apiV3.post(`/schema/objects/${object}/fields`, field);
  } catch (e) {
    if (e instanceof ApiV3.HttpError && e.response) {
      const invalids: V3InvalidSchemaDetail[] | undefined =
        e.response.data && e.response.data.detail && (e.response.data.detail.invalids as V3InvalidSchemaDetail[]);
      if (invalidsContain(invalids, 'name', (reason) => /^already used/.test(reason))) {
        throw new ApiFieldExistsError(e);
      }
    }
    throw e;
  }
}

/**
 * @hidden
 * Temporary validation until we update milton
 */
function validateCreateField(object: string, field: FieldDefinition, context?: AppContext) {
  if (context && context.app_id) {
    const prefix = `${context.app_id}_`;
    if (!object.startsWith(prefix)) {
      if (!field.name.startsWith(prefix)) {
        throw new ApiSchemaValidationError(`field name ${field.name} must be prefixed with ${prefix}`);
      }
      if (!field.display_name.startsWith(context.display_name)) {
        throw new ApiSchemaValidationError(
          `field display name ${field.display_name} must be prefixed with ${context.display_name}`
        );
      }
    }
  }
}
