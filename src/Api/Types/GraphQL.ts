import { Headers } from 'node-fetch';
import { ApiV3 } from '.';

/**
 * Additional information that may be returned by the GraphQL API.
 * See: https://spec.graphql.org/October2021/#sec-Response-Format
 */
export interface GqlExtensions {
  [key: string]: string;
}

/**
 * Error format for the GraphQL API.
 * See [GQL Error spec](https://spec.graphql.org/October2021/#sec-Errors)
 */
export interface GqlError {
  /**
   * Description of the error.
   */
  message: string;
  /**
   * A list of locations specifying where in the point in the document that caused the error.
   */
  locations?: [
    {
      line: number;
      column: number;
    }
  ];
  /**
   * A list of path segments that lead to the erroneous field.
   */
  path?: Array<string | number>;
  /**
   * Additional information that may be returned by the GraphQL API.
   */
  extensions?: GqlExtensions;
}

/**
 * Http response format for the GraphQL API. This is a variation of ApiV3.HttpResponse,
 * extended to include the standard fields from a GraphQL request.
 * See [GQL response data spec](https://spec.graphql.org/October2021/#sec-Data)
 */
export interface GqlHttpResponse<T extends ApiV3.V3Response> {
  success: boolean;
  status: number;
  statusText: string;
  headers: Headers;
  /**
   * The data returned by the query. Type T will be used to describe the data.
   * (undefined and null are both valid values from the spec)
   */
  data?: T | null;
  /**
   * Any errors that might be returned by the GraphQL API.
   */
  errors?: GqlError[];
  /**
   * Any additional information that might be returned by the GraphQL API.
   */
  extensions?: GqlExtensions;
}
