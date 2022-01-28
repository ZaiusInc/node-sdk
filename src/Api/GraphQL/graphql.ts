import { ApiV3 } from '../Types';
import { Result } from '../Types/GraphQL';

export async function graphql<T>(query: string, variables?: {[key: string]: any}): Promise<ApiV3.HttpResponse<Result<T>>> {
  return ApiV3.request(
    'POST',
    '/graphql',
    { query, variables }
  );
}
