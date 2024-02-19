import {Schema} from './Schema';
import {
  ApiV3,
  CreateIdentifierResponse,
  FieldDefinition,
  IdentifierDefinition, ModulesResponse,
  ObjectDefinition,
  RelationDefinition
} from './Types';
import {ODPClient} from './index';
import { createIdentifier } from './Schema/identifiers';
import { createField } from './Schema/fields';
import { createObject, getAllObjects, getObject } from './Schema/objects';
import { createRelation } from './Schema/relations';
import { enableModule, getEnabledModules } from './Schema/modules';

export class SchemaApi implements Schema {

  public constructor(private client: ODPClient) {
  }

  public createField(schemaObject: string, field: FieldDefinition): Promise<ApiV3.HttpResponse<FieldDefinition>> {
    return createField(this.client.v3Api, schemaObject, field);
  }

  public createIdentifier(identifier: IdentifierDefinition): Promise<ApiV3.HttpResponse<CreateIdentifierResponse>> {
    return createIdentifier(this.client.v3Api, identifier);
  }

  public createObject(schemaObject: ObjectDefinition): Promise<ApiV3.HttpResponse<ObjectDefinition>> {
    return createObject(this.client.v3Api, schemaObject);
  }

  public createRelation(
    schemaObject: string,
    relation: RelationDefinition
  ): Promise<ApiV3.HttpResponse<RelationDefinition>> {
    return createRelation(this.client.v3Api, schemaObject, relation);
  }

  public enableModule(module: string): Promise<ApiV3.HttpResponse<ModulesResponse>> {
    return enableModule(this.client.v3Api, module);
  }

  public getAllObjects(): Promise<ApiV3.HttpResponse<ObjectDefinition[]>> {
    return getAllObjects(this.client.v3Api);
  }

  public getEnabledModules(): Promise<ApiV3.HttpResponse<ModulesResponse>> {
    return getEnabledModules(this.client.v3Api);
  }

  public getObject(name: string): Promise<ApiV3.HttpResponse<ObjectDefinition>> {
    return getObject(this.client.v3Api, name);
  }
}
