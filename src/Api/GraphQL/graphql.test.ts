import {ApiV3} from '../lib/ApiV3';
import {MockInstance, vi} from 'vitest';
import {graphql} from './graphql';
import {InternalConfig} from '../config/configure';

describe('graphql', () => {
  const mockConfiguration: InternalConfig = {
    apiBasePath: 'https://api.zaius.com/v3/',
    apiKey: 'api-key',
  };
  const apiV3: ApiV3.API = new ApiV3.API(mockConfiguration);
  let postMock: MockInstance;
  beforeEach(() => {
    postMock = vi.spyOn(apiV3, 'post').mockReturnValue(Promise.resolve({} as any));
  });

  it('sends a query to /graphql', async () => {
    const query = '{}';
    postMock.mockReturnValue(
      Promise.resolve({
        success: true,
        data: {
          data: 'result data',
        },
      }) as any,
    );
    const result = await graphql(apiV3, query);
    expect(postMock).toHaveBeenCalledWith('/graphql', {query});
    expect(result).toEqual({
      success: true,
      data: 'result data',
    });
  });

  it('sends a query with variables to /graphql', async () => {
    const query = '{}';
    const variables = {};
    postMock.mockReturnValue(Promise.resolve({data: {data: 'result data'}}) as any);
    await graphql(apiV3, query, variables);
    expect(postMock).toHaveBeenCalledWith('/graphql', {query, variables});
  });
});
