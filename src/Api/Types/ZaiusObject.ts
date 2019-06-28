import {FieldValue} from './FieldValue';

/**
 * The Zaius Object payload.
 * See [V3 Objects API](https://zaius.services/docs/zaius_api.html#tag/Objects/operation/upsertObjects) for details.
 */
export interface ZaiusObject {
  [field: string]: FieldValue;
}
