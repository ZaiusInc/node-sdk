import {FieldValue} from './FieldValue';
import {Identifiers} from './Identifiers';

type EventFieldValue = FieldValue | EventData | EventData[];

/**
 * Datatype representing the data payload of an event
 */
export interface EventData extends Partial<DataSource> {
  [field: string]: EventFieldValue | undefined;
}

/**
 * The ODP Event payload.
 * See [V3 Event API](https://docs.developers.optimizely.com/optimizely-data-platform/reference/upload-events-1)
 * for details.
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

/**
 * Information about the source of an event or update.
 * All information is automatically filled in for ODP Apps and APIs,
 * but you can augment the data source by specifying your specific source.
 */
export interface DataSource {
  /**
   * The type of source, e.g., app, csv, api
   */
  data_source_type: string;
  /**
   * The actual source, e.g., name of your app, path of an API
   */
  data_source: string;
  /**
   * Details about the source of the event, for example, "Import Job:customer_load20200101"
   * This field can be used to help identify exactly where data and changes to data originated.
   */
  data_source_details: string;
  /**
   * Version information that might be useful for debugging. This version should correlate to the data_source
   * or primary processor of the data.
   */
  data_source_version: string;
}
