import {EventData} from '.';

/**
 * The payload for a Zaius messaging identifier consent update via v3 APIs.
 * See [V3 Consent API](https://docs.developers.zaius.com/api/rest-api/consent-legacy/consent)
 */
export interface ConsentUpdate {
  /**
   * The name of the messaging identifier field you want to update, e.g., email
   */
  identifier_field_name: string;
  /**
   * A valid messaging identifier value, such as an email address for the email identifier
   */
  identifier_value: string;
  /**
   * true indicates the customer consented to receive marketing communications on this identifier,
   * false indicates the customer has explicitly revoked consent to receive marketing communications, e.g.,
   * checked a box saying "I do not want to receive marketing communications."
   * Providing false WILL REVOKE consent if an identifier was previously consented.
   */
  consent: boolean;
  /**
   * A reason for updating consent. Should be human readable for audit purposes.
   */
  consent_update_reason?: string;
  /**
   * The time of the event if this is a historical change (defaults to current time).
   * Must be formated in ISO8601, provided as a Date object, or as a unix epoch.
   */
  consent_update_ts?: Date | string | number;
  /**
   * Additional event fields/values that should be included if a Zaius event is generated as a result of this update
   */
  event_data?: EventData;
}

/**
 * The response payload for fetching the consent status of a messaging identifier.
 * See [V3 Consent API](https://docs.developers.zaius.com/api/rest-api/consent)
 */
export interface GetConsentResponse {
  /**
   * The name of the messaging identifier field, e.g., email
   */
  identifier_field_name: string;
  /**
   * The messaging identifier value this information is relevant to, such as a customer's email address
   */
  identifier_value: string;
  /**
   * true if a customer consented to receive marketing communications on this identifier, false if they have
   * opted out of marketing communcation, null if there has been no explicit consent or opt out.
   */
  consent: boolean | null;
  /**
   * The reason for the update that last changed the consent status of this identifier
   */
  consent_update_reason: string | null;
  /**
   * The time (unix epoch, seconds) of the last update that last changed the consent status of this identifier
   */
  consent_update_ts: number | null;
}
