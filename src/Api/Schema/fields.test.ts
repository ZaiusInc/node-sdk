import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {ZaiusField} from '../Types/Schema';
import {ApiFieldExistsError} from './ApiFieldExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {createField} from './fields';

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

describe('fields', () => {
  describe('createField', () => {
    beforeAll(() => {
      ApiV3.configure(mockConfiguration);
    });

    it('sends a post to /schema/objects', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      const field: ZaiusField = {name: 'my_field', display_name: 'My Field', type: 'text'};
      await createField('my_object', field);
      expect(postFn).toHaveBeenCalledWith('/schema/objects/my_object/fields', field);
    });

    it('throws an error if too many events are sent in one call', async () => {
      const payload: ZaiusField[] = [];
      for (let i = 0; i < ApiV3.BATCH_LIMIT + 1; i++) {
        payload.push({name: `my_field_${i}`, display_name: `My Field ${i}`, type: 'text'});
      }

      expect.assertions(2);
      try {
        await createField('my_object', payload);
      } catch (error) {
        expect(error.message).toMatch(/maximum batch size/);
        expect(error.code).toEqual(ApiV3.ErrorCode.BatchLimitExceeded);
      }
    });

    it('throws an error if the api returns an error', async () => {
      jest.spyOn(ApiV3, 'post').mockRejectedValueOnce(new ApiV3.HttpError('Bad Request', undefined, {} as any));
      const field: ZaiusField = {name: 'my_field', display_name: 'My Field', type: 'text'};
      await expect(createField('my_object', field)).rejects.toThrowError('Bad Request');
    });

    it('throws an exists error if the field already exists', async () => {
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
      const field: ZaiusField = {name: 'my_field', display_name: 'My Field', type: 'text'};
      await expect(createField('my_object', field)).rejects.toThrowError(ApiFieldExistsError);
    });
  });

  describe('validateCreateFields', () => {
    beforeAll(() => {
      ApiV3.configure(mockAppConfiguration);
    });

    it('allows fields prefixed with app_id', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      const field: ZaiusField = {name: 'test_my_field', display_name: 'Test App My Field', type: 'text'};
      await createField('my_object', field);
      expect(postFn).toHaveBeenCalledWith('/schema/objects/my_object/fields', field);
    });

    it('throws a validation error if a field is not prefixed with app_id', async () => {
      const fields: ZaiusField[] = [
        {name: 'test_my_field', display_name: 'Test App My Field', type: 'text'},
        {name: 'other_field', display_name: 'Other Field', type: 'text'}
      ];
      await expect(createField('customers', fields)).rejects.toThrowError(ApiSchemaValidationError);
    });

    it('throws a validation error if a field display name is not prefixed with app display name', async () => {
      const field: ZaiusField = {name: 'test_my_field', display_name: 'My Field', type: 'text'};
      await expect(createField('customers', field)).rejects.toThrowError(/field display name.*must be prefixed/);
    });
  });
});
