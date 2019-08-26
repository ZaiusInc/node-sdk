import {FieldValue} from './FieldValue';

/**
 * The Zaius Object payload.
 * See [V3 Objects API](https://zaius.services/docs/zaius_api.html#tag/Objects/operation/upsertObjects) for details.
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
