import {
  ApiV3,
  CreateIdentifierResponse,
  FieldDefinition,
  IdentifierDefinition,
  ModulesResponse,
  ObjectDefinition, RelationDefinition
} from '../Types';

export * from './ApiFieldExistsError';
export * from './ApiIdentifierExistsError';
export * from './ApiObjectExistsError';
export * from './ApiRelationExistsError';
export * from './ApiSchemaValidationError';
export * from './ApiModuleAlreadyEnabledError';
export * from './ApiObjectNotFoundError';

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
