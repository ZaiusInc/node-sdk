import { ApiV3 } from '../Types';
import { GqlError, GqlHttpResponse, GqlExtensions } from '../Types/GraphQL';

interface QueryResult<T extends ApiV3.V3Response> {
  errors?: GqlError[];
  data?: T;
  extensions?: GqlExtensions;
}

/**
 * Queries the GraphQL API.
 *
 * @param apiV3 the v3 API instance to use
 * @param query the GQL query
 * @param variables named variables to substitute into the query, if any
 * @returns {GqlHttpResponse} if successful
 * @throws {HttpError} if it receives a non-2XX result
 */
export async function graphql<T extends ApiV3.V3Response>(
  apiV3: ApiV3.API,
  query: string,
  variables?: { [key: string]: any }
): Promise<GqlHttpResponse<T>> {
  const response = await apiV3.post<QueryResult<T>>('/graphql', { query, variables });
  const { data, extensions, errors } = response.data;
  return { ...response, data, extensions, errors };
}
