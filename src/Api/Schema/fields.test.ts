import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {FieldDefinition} from '../Types';
import {ApiFieldExistsError} from './ApiFieldExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {createField} from './fields';

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
    vendor: 'optimizely'
  }
};

let apiV3: ApiV3.API;

describe('fields', () => {
  describe('createField', () => {
    beforeAll(() => {
      apiV3 = new ApiV3.API(mockConfiguration);
    });

    it('sends a post to /schema/objects', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      const field: FieldDefinition = {name: 'my_field', display_name: 'My Field', type: 'string'};
      await createField(apiV3, 'my_object', field);
      expect(postFn).toHaveBeenCalledWith('/schema/objects/my_object/fields', field);
      postFn.mockRestore();
    });

    it('throws an error if the api returns an error', async () => {
      const postFn = jest
        .spyOn(apiV3, 'post')
        .mockRejectedValueOnce(new ApiV3.HttpError('Bad Request', undefined, {} as any));
      const field: FieldDefinition = {name: 'my_field', display_name: 'My Field', type: 'string'};
      await expect(createField(apiV3, 'my_object', field)).rejects.toThrowError('Bad Request');
      postFn.mockRestore();
    });

    it('throws an exists error if the field already exists', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockRejectedValueOnce(
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
      const field: FieldDefinition = {name: 'my_field', display_name: 'My Field', type: 'string'};
      await expect(createField(apiV3, 'my_object', field)).rejects.toThrowError(ApiFieldExistsError);
      postFn.mockRestore();
    });
  });

  describe('validateCreateFields', () => {
    beforeAll(() => {
      apiV3 = new ApiV3.API(mockAppConfiguration);
    });

    it('allows fields prefixed with app_id', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      const field: FieldDefinition = {name: 'test_my_field', display_name: 'Test App My Field', type: 'string'};
      await createField(apiV3, 'my_object', field);
      expect(postFn).toHaveBeenCalledWith('/schema/objects/my_object/fields', field);
      postFn.mockRestore();
    });

    it('throws a validation error if a field is not prefixed with app_id', async () => {
      const field: FieldDefinition = {name: 'other_field', display_name: 'Other Field', type: 'string'};
      await expect(createField(apiV3, 'customers', field)).rejects.toThrowError(ApiSchemaValidationError);
    });

    it('throws a validation error if a field display name is not prefixed with app display name', async () => {
      const field: FieldDefinition = {name: 'test_my_field', display_name: 'My Field', type: 'string'};
      await expect(createField(apiV3, 'customers', field)).rejects.toThrowError(/field display name.*must be prefixed/);
    });
  });
});
