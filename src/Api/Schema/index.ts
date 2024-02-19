import {ApiFieldExistsError} from './ApiFieldExistsError';
import {ApiIdentifierExistsError} from './ApiIdentifierExistsError';
import {ApiObjectExistsError} from './ApiObjectExistsError';
import {ApiRelationExistsError} from './ApiRelationExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {
  ApiV3,
  CreateIdentifierResponse,
  FieldDefinition,
  IdentifierDefinition,
  ModulesResponse,
  ObjectDefinition, RelationDefinition
} from '../Types';

export const schema = {
  ApiFieldExistsError,
  ApiIdentifierExistsError,
  ApiObjectExistsError,
  ApiRelationExistsError,
  ApiSchemaValidationError
};

export interface Schema {
  createField: (object: string, field: FieldDefinition) => Promise<ApiV3.HttpResponse<FieldDefinition>>;
  createIdentifier: (identifier: IdentifierDefinition) => Promise<ApiV3.HttpResponse<CreateIdentifierResponse>>;
  enableModule: (module: string) => Promise<ApiV3.HttpResponse<ModulesResponse>>;
  getEnabledModules: () => Promise<ApiV3.HttpResponse<ModulesResponse>>;
  getObject: (name: string) => Promise<ApiV3.HttpResponse<ObjectDefinition>>;
  getAllObjects: () => Promise<ApiV3.HttpResponse<ObjectDefinition[]>>;
  createObject: (object: ObjectDefinition) => Promise<ApiV3.HttpResponse<ObjectDefinition>>;
  createRelation: (object: string, relation: RelationDefinition) => Promise<ApiV3.HttpResponse<RelationDefinition>>;
}
