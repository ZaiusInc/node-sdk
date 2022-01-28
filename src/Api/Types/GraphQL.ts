/**
 * GraphQL response types.
 * See: https://spec.graphql.org/October2021/#sec-Response
 */

interface Extensions {
  [key: string]: string;
}

export interface Error {
  message: string;
  locations: [
    {
      line: number;
      column: number;
    }
  ];
  extensions?: Extensions;
}

export interface Data {
  [key: string]: any;
}

/**
 * The response format for a GraphQL request.
 * `data` will be populated on success with given type T.
 */
export interface Result<T extends Data> {
  errors?: Error[];
  data?: T;
  extensions?: Extensions;
}
