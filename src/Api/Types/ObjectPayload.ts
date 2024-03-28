import {FieldValue} from './FieldValue';

/**
 * The ODP Object payload.
 * See [V3 Objects API](https://docs.developers.optimizely.com/optimizely-data-platform/reference/update-object-1)
 * for details.
 */
export interface ObjectPayload {
  [field: string]: FieldValue;
}

/**
 * The response format for a successful post to the V3 Objects API.
 */
export interface ObjectResponse {
  title: string;
  status: number;
  timestamp: string;
}
