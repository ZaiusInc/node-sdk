import {FieldValue, PayloadOptions} from '../Types';

/**
 * @hidden
 */
export interface Payload {
  [field: string]: FieldValue | undefined;
}

/**
 * @hidden
 */
const DEFAULT_PAYLOAD_OPTIONS = {
  trimToNull: true,
  excludeNulls: true
};

/**
 * @hidden
 */
export class PayloadSanitizer {
  /**
   * Inline update of the payload based on the provided/default options
   *
   * @param payload to sanitize
   * @param opts for processing default {trimToNull & excludeNulls}
   */
  public static sanitize<T extends Payload>(payload: T, opts: PayloadOptions = {}): void {
    opts = {...DEFAULT_PAYLOAD_OPTIONS, ...opts};
    Object.entries(payload).forEach(([key, value]) => {
      if (typeof value === 'string') {
        if (opts.trimToNull) {
          value = value.trim();
          (payload as Payload)[key] = value.length === 0 ? null : value;
        }
      }
      if (opts.excludeNulls && payload[key] == null) {
        delete payload[key];
      }
    });
  }
}
