import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {IdentifierDefinition} from '../Types';
import {ApiIdentifierExistsError} from './ApiIdentifierExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {createIdentifier} from './identifiers';

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

describe('identifiers', () => {
  describe('createIdentifier', () => {
    beforeAll(() => {
      ApiV3.configure(mockConfiguration);
    });

    it('sends a post to /schema/objects', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      const identifier: IdentifierDefinition = {
        name: 'my_thing_id',
        display_name: 'My Thing ID',
        merge_confidence: 'low'
      };
      await createIdentifier(identifier);
      expect(postFn).toHaveBeenCalledWith('/schema/identifiers', identifier);
      postFn.mockRestore();
    });

    it('throws an error if the api returns an error', async () => {
      const postFn = jest
        .spyOn(ApiV3, 'post')
        .mockRejectedValueOnce(new ApiV3.HttpError('Bad Request', undefined, {} as any));
      const identifier: IdentifierDefinition = {
        name: 'my_thing_id',
        display_name: 'My Thing ID',
        merge_confidence: 'low'
      };
      await expect(createIdentifier(identifier)).rejects.toThrowError('Bad Request');
      postFn.mockRestore();
    });

    it('throws an exists error if the identifier already exists', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockRejectedValueOnce(
        new ApiV3.HttpError('Bad Request', undefined, {
          data: {
            detail: {
              invalids: [
                {
                  field: 'customers.name',
                  reason: 'already used by another field'
                }
              ]
            }
          }
        } as any)
      );
      const identifier: IdentifierDefinition = {
        name: 'my_thing_id',
        display_name: 'My Thing ID',
        merge_confidence: 'low'
      };
      await expect(createIdentifier(identifier)).rejects.toThrowError(ApiIdentifierExistsError);
      postFn.mockRestore();
    });
  });

  describe('validateCreateIdentifiers', () => {
    beforeAll(() => {
      ApiV3.configure(mockAppConfiguration);
    });

    it('allows identifiers prefixed with app_id', async () => {
      const postFn = jest.spyOn(ApiV3, 'post').mockResolvedValueOnce({} as any);
      const identifier: IdentifierDefinition = {
        name: 'test_my_thing_id',
        display_name: 'Test App My Thing ID',
        merge_confidence: 'low'
      };
      await createIdentifier(identifier);
      expect(postFn).toHaveBeenCalledWith('/schema/identifiers', identifier);
      postFn.mockRestore();
    });

    it('throws a validation error if a identifier is not prefixed with app_id', async () => {
      const identifier: IdentifierDefinition = {
        name: 'other_id',
        display_name: 'Other ID',
        merge_confidence: 'low'
      };
      await expect(createIdentifier(identifier)).rejects.toThrowError(ApiSchemaValidationError);
    });

    it('throws a validation error if a identifier display name is not prefixed with app display name', async () => {
      const identifier: IdentifierDefinition = {
        name: 'test_my_thing_id',
        display_name: 'My Thing ID',
        merge_confidence: 'low'
      };
      await expect(createIdentifier(identifier)).rejects.toThrowError(/identifier display name.*must be prefixed/);
    });
  });
});
