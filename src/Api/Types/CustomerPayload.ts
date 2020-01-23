import {FieldValue} from './FieldValue';
import {Identifiers} from './Identifiers';

/**
 * The Zaius Customer payload. See
 * [V3 Customers API](https://docs.developers.zaius.com/api/rest-api/customers)
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
    [field: string]: FieldValue;
  };
}

/**
 * The response format for a successful post to the V3 Customers API.
 */
export interface CustomerResponse {
  title: string;
  status: number;
  timestamp: string;
}
