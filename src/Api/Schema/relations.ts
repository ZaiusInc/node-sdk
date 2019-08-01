import {ApiV3} from '../lib/ApiV3';
import {RelationDefinition} from '../Types';
import {ApiRelationExistsError} from './ApiRelationExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';

/**
 * @hidden
 */
interface InvalidDetail {
  field: string;
  reason: string;
}

/**
 * Create a custom Zaius relation between two objects
 * @param object the object to create the foreign key on
 * @param relation the relation to create
 * @throws {ApiRelationExistsError} if the relation name is already in use by another field or relation
 */
export async function createRelation(object: string, relation: RelationDefinition): Promise<ApiV3.HttpResponse> {
  validateCreateRelation(relation);

  try {
    return await ApiV3.post(`/schema/objects/${object}/relations`, relation);
  } catch (e) {
    if (e instanceof ApiV3.HttpError && e.response) {
      const invalids: InvalidDetail[] = e.response.data && e.response.data.detail && e.response.data.detail.invalids;
      if (invalids && invalids.find((detail) => detail.field === 'name' && /^already used/.test(detail.reason))) {
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
function validateCreateRelation(relation: RelationDefinition) {
  const context = ApiV3.getAppContext();
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
