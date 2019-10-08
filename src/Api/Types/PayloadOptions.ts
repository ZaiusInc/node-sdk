/**
 * Payload formatting options.
 */
export interface PayloadOptions {
  /**
   * When true (default) the trim to null option will trim all string value fields and if
   * the result is an empty string the value is changed to null.
   */
  trimToNull?: boolean;

  /**
   * When true (default) the exclude nulls option will remove null valued fields in the payload.
   */
  excludeNulls?: boolean;
}
