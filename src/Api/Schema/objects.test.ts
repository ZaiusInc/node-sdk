import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {ObjectDefinition} from '../Types';
import {ApiObjectExistsError} from './ApiObjectExistsError';
import {ApiObjectNotFoundError} from './ApiObjectNotFoundError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {createObject, getAllObjects, getObject} from './objects';

const mockConfiguration: InternalConfig = {
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key'
};

const mockAppConfiguration: InternalConfig = {
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
  describe('getObject', () => {
    beforeAll(() => {
      ApiV3.configure(mockConfiguration);
    });

    it('sends a get to /schema/objects/{object_name}', async () => {
      const getFn = jest.spyOn(ApiV3, 'get').mockResolvedValueOnce({} as any);
      await getObject('my_object');
      expect(getFn).toHaveBeenCalledWith('/schema/objects/my_object');
      getFn.mockRestore();
    });

    it('throws an error if the api returns an error', async () => {
      const getFn = jest
        .spyOn(ApiV3, 'get')
        .mockRejectedValueOnce(new ApiV3.HttpError('Gateway Timeout', undefined, {} as any));
      await expect(getObject('my_object')).rejects.toThrowError('Gateway Timeout');
      getFn.mockRestore();
    });

    it('throws a not found error if the object does not exist', async () => {
      const getFn = jest
        .spyOn(ApiV3, 'get')
        .mockRejectedValueOnce(new ApiV3.HttpError('Not Found', undefined, {status: 404} as any));
      await expect(getObject('my_object')).rejects.toThrowError(ApiObjectNotFoundError);
      getFn.mockRestore();
    });
  });

  describe('getAllObjects', () => {
    beforeAll(() => {
      ApiV3.configure(mockConfiguration);
    });

    it('sends a get to /schema/objects', async () => {
      const getFn = jest.spyOn(ApiV3, 'get').mockResolvedValueOnce({} as any);
      await getAllObjects();
      expect(getFn).toHaveBeenCalledWith('/schema/objects');
      getFn.mockRestore();
    });

    it('throws an error if the api returns an error', async () => {
      const getFn = jest
        .spyOn(ApiV3, 'get')
        .mockRejectedValueOnce(new ApiV3.HttpError('Access Denied', undefined, {} as any));
      await expect(getAllObjects()).rejects.toThrowError('Access Denied');
      getFn.mockRestore();
    });
  });

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
      postFn.mockRestore();
    });

    it('throws an error if the api returns an error', async () => {
      const postFn = jest
        .spyOn(ApiV3, 'post')
        .mockRejectedValueOnce(new ApiV3.HttpError('Bad Request', undefined, {} as any));
      const object: ObjectDefinition = {
        name: 'my_object',
        display_name: 'My Object',
        fields: [{name: 'id', display_name: 'ID', type: 'string'}]
      };
      await expect(createObject(object)).rejects.toThrowError('Bad Request');
      postFn.mockRestore();
    });

    it('throws an exists error if the object already exists', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockRejectedValueOnce(
        new ApiV3.HttpError('Bad Request', undefined, {
          data: {
            detail: {
              invalids: [
                {
                  field: 'name',
                  reason: 'already used by another object'
                }
              ]
            }
          }
        } as any)
      );
      const object: ObjectDefinition = {
        name: 'my_object',
        display_name: 'My Object',
        fields: [{name: 'id', display_name: 'ID', type: 'string'}]
      };
      await expect(createObject(object)).rejects.toThrowError(ApiObjectExistsError);
      postFn.mockRestore();
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
      postFn.mockRestore();
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
