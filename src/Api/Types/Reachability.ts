import {EventData} from '.';

/**
 * The type of reason for updating the reachability status of a messaging identifier
 */
export type ReachabilityUpdateType =
  | 'hard_bounce'
  | 'soft_bounce'
  | 'spam_report'
  | 'uninstall'
  | 'invalid_identifier'
  | 'returned_to_sender'
  | 'unknown'
  | 'expired'
  | 'other';

/**
 * The payload for a Zaius messaging identifier reachability update via v3 APIs.
 * See [V3 Reachability API](https://docs.developers.zaius.com/api/rest-api/advanced/identifiers/reachability)
 */
export interface ReachabilityUpdate {
  /**
   * true indicates the identifier value is now reachable, false indicates it is no longer reachable
   */
  reachable: boolean;
  /**
   * The type of change to the reachability status.
   * If reachable is set to true, this field must be left null.
   * If reachable is false, this field is required.
   */
  reachable_update_type?: ReachabilityUpdateType;
  /**
   * A specific error code or note for the change type. Should be human readable.
   */
  reachable_update_reason?: string;
  /**
   * The time of the event if this is a historical change (defaults to current time).
   * Must be formated in ISO8601 or provided as a Date object.
   */
  reachable_update_ts?: Date | string;
  /**
   * Additional event fields/values that should be included if a Zaius event is generated as a result of this update
   */
  event_data?: EventData;
}

/**
 * The response payload for fetching the reachability details of a messaging identifier.
 * See [V3 Reachability API](https://docs.developers.zaius.com/api/rest-api/advanced/identifiers/reachability)
 */
export interface GetReachabilityResponse {
  /**
   * The name of the messaging identifier field, e.g., email
   */
  identifier_field_name: string;
  /**
   * The messaging identifier value this information is relevant to, such as a customer's email address
   */
  identifier_value: string;
  /**
   * true if this specific messaging identifier is considered reachable by Zaius, false otherwise
   */
  reachable: boolean;
  /**
   * The type of update that last changed the reachability of this identifier
   */
  reachable_update_type: ReachabilityUpdateType;
  /**
   * The reason for the update that last changed the reachability of this identifier
   */
  reachable_update_reason: string | null;
  /**
   * The time (unix epoch, seconds) of the last update that last changed the reachability of this identifier
   */
  reachable_update_ts: number | null;
}
