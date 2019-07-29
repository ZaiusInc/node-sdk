import {FieldValue} from './FieldValue';
import {Identifiers} from './Identifiers';

/**
 * The Zaius Customer payload. See
 * [V3 Customers API](https://zaius.services/docs/zaius_api.html#tag/Customer-Profiles/operation/upsertCustomers)
 * for details.
 */
export interface CustomerPayload {
  /**
   * A set of identifiers that uniquely identify the customer.
   * At least one identifier is required.
   */
  identifiers: Identifiers;
  /**
   * A set of known customer attributes such as name, timezone, etc.
   */
  attributes: {
    [field: string]: FieldValue
  };
}
