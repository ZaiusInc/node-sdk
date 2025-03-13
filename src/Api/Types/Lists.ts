import {DataSource} from './EventPayload';

export interface ListUpdate {
  /**
   * The identifier field & value you provided, for example, email: "foo@mail.com" will be included in this object.
   * Note: boolean is only used for the subscribed property of this object.
   */
  [identifierFieldName: string]: string | boolean;
  /**
   * The id of the ODP list
   */
  list_id: string;
  /**
   * true if the customer is subscribed to this list
   */
  subscribed: boolean;
}

/* eslint-disable max-len */
/**
 * Response from ODP V3 list subscribe/unsubscribe APIs
 * See [V3 List APIs](https://docs.developers.optimizely.com/optimizely-data-platform/reference/get-subscription-status-1)
 */
/* eslint-enable max-len */
export interface ListUpdateResponse {
  /**
   * A list of updates that were made due to this request
   */
  updates: ListUpdate[];
}

export interface ListUpdateRequest {
  /**
   * The identifier field & value you wish to subscribe or unsubscribe, for example, email: "foo@mail.com".
   * Note: boolean/undefined are not valid identifier values, but required for this TS interface.
   */
  [identifierFieldName: string]: string | boolean | undefined;
  /**
   * The id of the ODP list
   */
  list_id?: string;
  /**
   * true to subscribe the customer to this list, false to unsubscribe the customer
   */
  subscribed: boolean;
}

/**
 * Response from ODP V3 list create API
 * See [V3 List APIs](https://docs.developers.optimizely.com/optimizely-data-platform/reference/create-list-1)
 */
export interface CreateListResponse {
  created: {
    /**
     * The generated list id to be used for list subscription APIs
     */
    list_id: string;
    /**
     * The human readable name you provided for the list
     */
    name: string;
  };
}

export interface ListDefinition extends DataSource {
  /**
   * The generated list id to be used for list subscription APIs
   */
  list_id: string;
  /**
   * The human readable name you provided for the list
   */
  name: string;
  /**
   * ISO8601 date string representing the date and time the list was created
   */
  created_at: string;
}

/**
 * Response from the ODP V3 get lists API
 * See [V3 List APIs](https://docs.developers.optimizely.com/optimizely-data-platform/reference/get-lists-1)
 */
export interface GetListsResponse {
  /**
   * An array of marketing lists known to ODP
   */
  lists: ListDefinition[];
}
