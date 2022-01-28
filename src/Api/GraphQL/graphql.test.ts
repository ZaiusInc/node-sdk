import {ApiV3} from '../lib/ApiV3';
import {graphql} from './graphql';

describe('graphql', () => {
  let requestMock!: jest.Mock;
  beforeEach(() => {
    requestMock = jest.spyOn(ApiV3, 'request').mockReturnValue(Promise.resolve({} as any));
  });

  it('sends a query to /graphql', async () => {
    const query = '{}';
    await graphql(query);
    expect(requestMock).toHaveBeenCalledWith('POST', '/graphql', {query});
  });
});
