import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {ObjectDefinition} from '../Types';
import {ApiObjectExistsError} from './ApiObjectExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {createObject} from './objects';

const mockConfiguration: InternalConfig = {
  trackerId: 'vdl',
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key'
};

const mockAppConfiguration: InternalConfig = {
  trackerId: 'vdl',
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key',
  appContext: {
    app_id: 'test',
    display_name: 'Test App',
    version: '1.0.0',
    vendor: 'zaius'
  }
};

describe('objects', () => {
  describe('createObject', () => {
    beforeAll(() => {
      ApiV3.configure(mockConfiguration);
    });

    it('sends a post to /schema/objects', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      const object: ObjectDefinition = {
        name: 'my_object',
        display_name: 'My Object',
        fields: [{name: 'id', display_name: 'ID', type: 'string'}]
      };
      await createObject(object);
      expect(postFn).toHaveBeenCalledWith('/schema/objects', object);
    });

    it('throws an error if the api returns an error', async () => {
      jest.spyOn(ApiV3, 'post').mockRejectedValueOnce(new ApiV3.HttpError('Bad Request', undefined, {} as any));
      const object: ObjectDefinition = {
        name: 'my_object',
        display_name: 'My Object',
        fields: [{name: 'id', display_name: 'ID', type: 'string'}]
      };
      await expect(createObject(object)).rejects.toThrowError('Bad Request');
    });

    it('throws an exists error if the object already exists', async () => {
      jest.spyOn(ApiV3, 'post').mockRejectedValueOnce(new ApiV3.HttpError('Bad Request', undefined, {
        data: {
          detail: {
            invalids: [{
              field: 'name',
              reason: 'already used by another object'
            }]
          }
        }
      } as any));
      const object: ObjectDefinition = {
        name: 'my_object',
        display_name: 'My Object',
        fields: [{name: 'id', display_name: 'ID', type: 'string'}]
      };
      await expect(createObject(object)).rejects.toThrowError(ApiObjectExistsError);
    });
  });

  describe('validateCreateObjects', () => {
    beforeAll(() => {
      ApiV3.configure(mockAppConfiguration);
    });

    it('allows objects prefixed with app_id', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      const object: ObjectDefinition = {
        name: 'test_my_object',
        display_name: 'Test App My Object',
        fields: [{name: 'id', display_name: 'ID', type: 'string'}]
      };
      await createObject(object);
      expect(postFn).toHaveBeenCalledWith('/schema/objects', object);
    });

    it('throws a validation error if an object is not prefixed with app_id', async () => {
      const object: ObjectDefinition = {
        name: 'other_object',
        display_name: 'Other Object',
        fields: [{name: 'id', display_name: 'ID', type: 'string'}]
      };
      await expect(createObject(object)).rejects.toThrowError(ApiSchemaValidationError);
    });

    it('throws a validation error if an object alias is not prefixed with app_id', async () => {
      const object: ObjectDefinition = {
        name: 'test_my_object',
        display_name: 'Test App My Object',
        alias: 'my_object',
        fields: [{name: 'id', display_name: 'ID', type: 'string'}]
      };
      await expect(createObject(object)).rejects.toThrowError(/object alias.*must be prefixed/);
    });

    it('throws a validation error if an object display name is not prefixed with app display name', async () => {
      const object: ObjectDefinition = {
        name: 'test_my_object',
        display_name: 'My Object',
        fields: [{name: 'id', display_name: 'ID', type: 'string'}]
      };
      await expect(createObject(object)).rejects.toThrowError(/object display name.*must be prefixed/);
    });
  });
});
