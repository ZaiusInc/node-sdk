import {ApiV3} from '../lib/ApiV3';
import {graphql} from './graphql';

describe('graphql', () => {
  let postMock!: jest.SpyInstance;
  beforeEach(() => {
    postMock = jest.spyOn(ApiV3, 'post').mockReturnValue(Promise.resolve({} as any));
  });

  it('sends a query to /graphql', async () => {
    const query = '{}';
    postMock.mockReturnValue({
      success: true,
      data: {
        data: 'result data'
      }
    });
    const result = await graphql(query);
    expect(postMock).toHaveBeenCalledWith('/graphql', {query});
    expect(result).toEqual({
      success: true,
      data: 'result data'
    });
  });

  it('sends a query with variables to /graphql', async () => {
    const query = '{}';
    const variables = {};
    postMock.mockReturnValue({ data: { data: 'result data' } });
    await graphql(query, variables);
    expect(postMock).toHaveBeenCalledWith('/graphql', {query, variables});
  });
});
