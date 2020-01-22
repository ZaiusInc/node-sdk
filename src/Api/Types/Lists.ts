export interface ListUpdate {
  /**
   * The id of the Zaius list
   */
  list_id: string;
  /**
   * true if the customer is subscribed to this list
   */
  subscribed: boolean;
  /**
   * The identifier field & value you provided, e.g., email: "foo@zaius.com" will be included in this object.
   * Note: boolean is only used for the subscribed property of this object.
   */
  [identifierFieldName: string]: string | boolean;
}

/**
 * Response from Zaius V3 list subscribe/unsubscribe APIs
 * See: [V3 List APIs](https://docs.developers.zaius.com/api/rest-api/lists)
 */
export interface ListUpdateResponse {
  /**
   * A list of updates that were made due to this request
   */
  updates: ListUpdate[];
}

export interface ListUpdateRequest {
  /**
   * The id of the Zaius list
   */
  list_id?: string;
  /**
   * true to subscribe the customer to this list, false to unsubscribe the customer
   */
  subscribed: boolean;
  /**
   * The identifier field & value you wish to subscribe or unsubscribe, e.g., email: "foo@zaius.com".
   * Note: boolean/undefined are not valid identifier values, but required for this TS interface.
   */
  [identifierFieldName: string]: string | boolean | undefined;
}
