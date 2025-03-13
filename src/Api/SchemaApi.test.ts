import {ODPClient} from './index';
import * as fields from './Schema/fields';
import * as objects from './Schema/objects';
import * as identifiers from './Schema/identifiers';
import * as modules from './Schema/modules';
import * as relations from './Schema/relations';
import {SchemaApi} from './SchemaApi';
import {FieldDefinition, IdentifierDefinition, ObjectDefinition, RelationDefinition} from './Types';

describe('SchemaApi', () => {
  let api: SchemaApi;
  let odpClient: ODPClient;

  beforeEach(() => {
    odpClient = new ODPClient();
    api = new SchemaApi(odpClient);
  });

  it('should create field', async () => {
    jest.spyOn(fields, 'createField').mockReturnValue(Promise.resolve({} as any));

    const objectName = 'testObject';
    const field: FieldDefinition = {
      display_name: 'test field',
      name: 'test_field',
      type: 'string',
    };
    await api.createField(objectName, field);
    expect(fields.createField).toHaveBeenCalledWith(odpClient.v3Api, objectName, field);
  });

  it('should create object', async () => {
    jest.spyOn(objects, 'createObject').mockReturnValue(Promise.resolve({} as any));

    const objectDefinition: ObjectDefinition = {
      fields: [],
      display_name: 'test object',
      name: 'test_object',
    };
    await api.createObject(objectDefinition);
    expect(objects.createObject).toHaveBeenCalledWith(odpClient.v3Api, objectDefinition);
  });

  it('should get object', async () => {
    jest.spyOn(objects, 'getObject').mockReturnValue(Promise.resolve({} as any));

    const objectName = 'testObject';
    await api.getObject(objectName);
    expect(objects.getObject).toHaveBeenCalledWith(odpClient.v3Api, objectName);
  });

  it('should get all objects', async () => {
    jest.spyOn(objects, 'getAllObjects').mockReturnValue(Promise.resolve({} as any));

    await api.getAllObjects();
    expect(objects.getAllObjects).toHaveBeenCalledWith(odpClient.v3Api);
  });

  it('should create identifier', async () => {
    jest.spyOn(identifiers, 'createIdentifier').mockReturnValue(Promise.resolve({} as any));

    const identifier: IdentifierDefinition = {
      display_name: 'test id',
      merge_confidence: 'high',
      name: 'test_id',
    };
    await api.createIdentifier(identifier);
    expect(identifiers.createIdentifier).toHaveBeenCalledWith(odpClient.v3Api, identifier);
  });

  it('should enable module', async () => {
    jest.spyOn(modules, 'enableModule').mockReturnValue(Promise.resolve({} as any));

    const module = 'testModule';
    await api.enableModule(module);
    expect(modules.enableModule).toHaveBeenCalledWith(odpClient.v3Api, module);
  });

  it('should get enabled modules', async () => {
    jest.spyOn(modules, 'getEnabledModules').mockReturnValue(Promise.resolve({} as any));

    await api.getEnabledModules();
    expect(modules.getEnabledModules).toHaveBeenCalledWith(odpClient.v3Api);
  });

  it('should create relation', async () => {
    jest.spyOn(relations, 'createRelation').mockReturnValue(Promise.resolve({} as any));

    const objectName = 'testObject';
    const relation: RelationDefinition = {
      child_object: 'testChildObject',
      display_name: 'test relation',
      join_fields: [],
      name: 'testRelation',
    };
    await api.createRelation(objectName, relation);
    expect(relations.createRelation).toHaveBeenCalledWith(odpClient.v3Api, objectName, relation);
  });
});
