import { ApiV3 } from '../Types';
import { Result, Data } from '../Types/GraphQL';

/**
 * Queries the GraphQL API.
 * @param query the GQL query
 * @param variables named variables to substitute into the query, if any
 * @returns the response from the API if successful
 * @throws {HttpError} if it receives a non-2XX result
 */
export function graphql<T extends Data>(
  query: string,
  variables?: { [key: string]: any }
): Promise<ApiV3.HttpResponse<Result<T>>> {
  return ApiV3.request(
    'POST',
    '/graphql',
    { query, variables }
  );
}
