import {FieldValue} from './FieldValue';
import {Identifiers} from './Identifiers';

type EventFieldValue = FieldValue | EventData | EventData[];

/**
 * Datatype representing the data payload of an event
 */
export interface EventData {
  [field: string]: EventFieldValue;
}

/**
 * The Zaius Event payload.
 * See [V3 Event API](https://zaius.services/docs/zaius_api.html#tag/Events/operation/insertEvents) for details.
 */
export interface EventPayload {
  /**
   * Event type (required), e.g., `product`
   */
  type: string;
  /**
   * Event action, e.g., `detail`
   */
  action?: string;
  /**
   * A set of identifiers that uniquely identify the user the event belongs to.
   * At least one identifier is required.
   */
  identifiers: Identifiers;
  /**
   * The event payload
   */
  data: EventData;
}

/**
 * The response format for a successful post to the V3 Event API.
 */
export interface EventResponse {
  title: string;
  status: number;
  timestamp: string;
}
