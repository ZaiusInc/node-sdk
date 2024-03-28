import {ApiV3} from '../lib/ApiV3';
import {CreateIdentifierResponse, IdentifierDefinition} from '../Types';
import {ApiIdentifierExistsError} from './ApiIdentifierExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {invalidsContain} from './invalidsContain';
import V3InvalidSchemaDetail = ApiV3.V3InvalidSchemaDetail;
import {AppContext} from '../config/configure';

/**
 * Create a customer identifier
 * @param apiV3 the v3 API instance to use
 * @param identifier the identifier to create
 * @throws {ApiIdentifierExistsError} if the identifier already exists
 * @throws {HttpError} if it receives any other non-2XX result
 */
export async function createIdentifier(
  apiV3: ApiV3.API,
  identifier: IdentifierDefinition
): Promise<ApiV3.HttpResponse<CreateIdentifierResponse>> {
  validateCreateIdentifier(identifier, apiV3.getContext());

  try {
    return await apiV3.post('/schema/identifiers', identifier);
  } catch (e) {
    if (e instanceof ApiV3.HttpError && e.response) {
      const invalids: V3InvalidSchemaDetail[] | undefined =
        e.response.data && e.response.data.detail && (e.response.data.detail.invalids as V3InvalidSchemaDetail[]);
      if (invalidsContain(invalids, 'customers.name', (reason) => /^already used/.test(reason))) {
        throw new ApiIdentifierExistsError(e);
      }
    }
    throw e;
  }
}

/**
 * @hidden
 * Temporary validation until we update milton
 */
function validateCreateIdentifier(identifier: IdentifierDefinition, context?: AppContext) {
  if (context && context.app_id) {
    const prefix = `${context.app_id}_`;
    if (!identifier.name.startsWith(prefix)) {
      throw new ApiSchemaValidationError(`identifier name ${identifier.name} must be prefixed with ${prefix}`);
    }
    if (!identifier.display_name.startsWith(context.display_name)) {
      throw new ApiSchemaValidationError(
        `identifier display name ${identifier.display_name} must be prefixed with ${context.display_name}`
      );
    }
  }
}
