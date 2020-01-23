import {ApiFieldExistsError} from './ApiFieldExistsError';
import {ApiIdentifierExistsError} from './ApiIdentifierExistsError';
import {ApiObjectExistsError} from './ApiObjectExistsError';
import {ApiRelationExistsError} from './ApiRelationExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {createField} from './fields';
import {createIdentifier} from './identifiers';
import {enableModule, getEnabledModules} from './modules';
import {createObject} from './objects';
import {createRelation} from './relations';

export const schema = {
  ApiFieldExistsError,
  ApiIdentifierExistsError,
  ApiObjectExistsError,
  ApiRelationExistsError,
  ApiSchemaValidationError,
  createField,
  createIdentifier,
  enableModule,
  getEnabledModules,
  createObject,
  createRelation
};
