import {ApiV3} from '../lib/ApiV3';
import {ZaiusField} from '../Types/Schema';
import {ApiFieldExistsError} from './ApiFieldExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';

/**
 * Create a custom field on a Zaius object
 * @param object the Zaius object to create the field on, e.g., `customers`
 * @param field the field or array of fields to create
 * @throws {HttpError} if it receives a non-2XX result or if the batch size is > BATCH_LIMIT
 * @throws {ApiFieldExistsError} if the field name already exists
 */
export async function createField(object: string, field: ZaiusField | ZaiusField[]): Promise<ApiV3.HttpResponse> {
  if (Array.isArray(field) && field.length > ApiV3.BATCH_LIMIT) {
    return Promise.reject(ApiV3.errorForCode(ApiV3.ErrorCode.BatchLimitExceeded));
  }

  validateCreateFields(object, Array.isArray(field) ? field : [field]);

  try {
    return await ApiV3.post(`/schema/objects/${object}/fields`, field);
  } catch (e) {
    if (e instanceof ApiV3.HttpError && e.response) {
      const invalids: InvalidDetail[] = e.response.data && e.response.data.detail && e.response.data.detail.invalids;
      if (invalids && invalids.find((detail) => detail.field === 'name' && /^already used/.test(detail.reason))) {
        throw new ApiFieldExistsError(e);
      }
    }
    throw e;
  }
}

interface InvalidDetail {
  field: string;
  reason: string;
}

/**
 * @hidden
 * Temporary validation until we update milton
 */
function validateCreateFields(object: string, fields: ZaiusField[]) {
  const context = ApiV3.getAppContext();
  if (context && context.app_id) {
    const prefix = `${context.app_id}_`;
    if (!object.startsWith(prefix)) {
      fields.forEach((field) => {
        if (!field.name.startsWith(prefix)) {
          throw new ApiSchemaValidationError(`field name ${field.name} must be prefixed with ${prefix}`);
        }
        if (!field.display_name.startsWith(context.display_name)) {
          throw new ApiSchemaValidationError(
            `field display name ${field.display_name} must be prefixed with ${context.display_name}`
          );
        }
      });
    }
  }
}
