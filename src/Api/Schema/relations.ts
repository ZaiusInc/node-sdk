import {ApiV3} from '../lib/ApiV3';
import {RelationDefinition} from '../Types';
import {ApiRelationExistsError} from './ApiRelationExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {invalidsContain} from './invalidsContain';
import V3InvalidSchemaDetail = ApiV3.V3InvalidSchemaDetail;
import {AppContext} from '../config/configure';

/**
 * Create a custom ODP relation between two objects
 * @param apiV3 the v3 API instance to use
 * @param object the object to create the foreign key on
 * @param relation the relation to create
 * @throws {ApiRelationExistsError} if the relation name is already in use by another field or relation
 * @throws {HttpError} if it receives any other non-2XX result
 */
export async function createRelation(
  apiV3: ApiV3.API,
  object: string,
  relation: RelationDefinition
): Promise<ApiV3.HttpResponse<RelationDefinition>> {
  validateCreateRelation(relation, apiV3.getContext());

  try {
    return await apiV3.post(`/schema/objects/${object}/relations`, relation);
  } catch (e) {
    if (e instanceof ApiV3.HttpError && e.response) {
      const invalids: V3InvalidSchemaDetail[] | undefined =
        e.response.data && e.response.data.detail && (e.response.data.detail.invalids as V3InvalidSchemaDetail[]);
      if (invalidsContain(invalids, 'name', (reason) => /^already used/.test(reason))) {
        throw new ApiRelationExistsError(e);
      }
    }
    throw e;
  }
}

/**
 * @hidden
 * Temporary validation until we update milton
 */
function validateCreateRelation(relation: RelationDefinition, context?: AppContext) {
  if (context && context.app_id) {
    const prefix = `${context.app_id}_`;
    if (relation.join_fields.find((joinField) => joinField.parent.startsWith(prefix))) {
      if (!relation.name.startsWith(prefix)) {
        throw new ApiSchemaValidationError(`relation name ${relation.name} must be prefixed with ${prefix}`);
      }
      if (!relation.display_name.startsWith(context.display_name)) {
        throw new ApiSchemaValidationError(
          `relation display name ${relation.display_name} must be prefixed with ${context.display_name}`
        );
      }
    }
  }
}
