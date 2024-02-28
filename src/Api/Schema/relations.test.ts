import 'jest';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {RelationDefinition} from '../Types';
import {ApiRelationExistsError} from './ApiRelationExistsError';
import {ApiSchemaValidationError} from './ApiSchemaValidationError';
import {createRelation} from './relations';

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

describe('relations', () => {
  describe('createRelation', () => {
    beforeAll(() => {
      apiV3 = new ApiV3.API(mockConfiguration);
    });

    it('sends a post to /schema/objects/customers/relations', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      const relation: RelationDefinition = {
        name: 'favorite_product',
        display_name: 'Favorite product',
        child_object: 'products',
        join_fields: [{parent: 'favorite_product_id', child: 'product_id'}]
      };
      await createRelation(apiV3, 'customers', relation);
      expect(postFn).toHaveBeenCalledWith('/schema/objects/customers/relations', relation);
      postFn.mockRestore();
    });

    it('throws an error if the api returns an error', async () => {
      const postFn = jest
        .spyOn(apiV3, 'post')
        .mockRejectedValueOnce(new ApiV3.HttpError('Bad Request', undefined, {} as any));
      const relation: RelationDefinition = {
        name: 'favorite_product',
        display_name: 'Favorite product',
        child_object: 'products',
        join_fields: [{parent: 'favorite_product_id', child: 'product_id'}]
      };
      await expect(createRelation(apiV3, 'customers', relation)).rejects.toThrowError('Bad Request');
      postFn.mockRestore();
    });

    it('throws an exists error if the relation already exists', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockRejectedValueOnce(
        new ApiV3.HttpError('Bad Request', undefined, {
          data: {
            detail: {
              invalids: [
                {
                  field: 'name',
                  reason: 'already used by another relation'
                }
              ]
            }
          }
        } as any)
      );
      const relation: RelationDefinition = {
        name: 'favorite_product',
        display_name: 'Favorite product',
        child_object: 'products',
        join_fields: [{parent: 'favorite_product_id', child: 'product_id'}]
      };
      await expect(createRelation(apiV3, 'customers', relation)).rejects.toThrowError(ApiRelationExistsError);
      postFn.mockRestore();
    });
  });

  describe('validateCreateRelations', () => {
    beforeAll(() => {
      apiV3 = new ApiV3.API(mockAppConfiguration);
    });

    it('allows relations without prefixes when the field is not owned by the app', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      const relation: RelationDefinition = {
        name: 'loyalty_tier',
        display_name: 'Loyalty Tier',
        child_object: 'loyalty_tiers',
        join_fields: [{parent: 'loyalty_tier_id', child: 'id'}]
      };
      await createRelation(apiV3, 'test_profile', relation);
      expect(postFn).toHaveBeenCalledWith('/schema/objects/test_profile/relations', relation);
      postFn.mockRestore();
    });

    it('allows relations prefixed with app_id', async () => {
      const postFn = jest.spyOn(apiV3, 'post').mockResolvedValueOnce({} as any);
      const relation: RelationDefinition = {
        name: 'test_loyalty_tier',
        display_name: 'Test App Loyalty Tier',
        child_object: 'test_loyalty_tiers',
        join_fields: [{parent: 'test_loyalty_tier_id', child: 'test_loyalty_tiers'}]
      };
      await createRelation(apiV3, 'customers', relation);
      expect(postFn).toHaveBeenCalledWith('/schema/objects/customers/relations', relation);
      postFn.mockRestore();
    });

    it('throws a validation error if an relation is not prefixed with app_id', async () => {
      const relation: RelationDefinition = {
        name: 'loyalty_tier',
        display_name: 'Test App Loyalty Tier',
        child_object: 'test_loyalty_tiers',
        join_fields: [{parent: 'test_loyalty_tier_id', child: 'test_loyalty_tiers'}]
      };
      await expect(createRelation(apiV3, 'customers', relation)).rejects.toThrowError(ApiSchemaValidationError);
    });

    it('throws a validation error if an relation display name is not prefixed with app display name', async () => {
      const relation: RelationDefinition = {
        name: 'test_loyalty_tier',
        display_name: 'Loyalty Tier',
        child_object: 'test_loyalty_tiers',
        join_fields: [{parent: 'test_loyalty_tier_id', child: 'test_loyalty_tiers'}]
      };
      await expect(createRelation(apiV3, 'customers', relation)).rejects.toThrowError(
        /relation display name.*must be prefixed/
      );
    });
  });
});
