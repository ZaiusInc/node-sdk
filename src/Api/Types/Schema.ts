/**
 * The Zaius Field definition payload for schema APIs.
 * See [V3 Schema API](https://old.developers.zaius.com/v3/reference#create-fields-2) for details.
 */
export interface FieldDefinition {
  /**
   * The name of the field-lower snake case, alphanumeric, must start with an alpha character.
   * Must be unique across all field names within the object.
   */
  name: string;
  /**
   * The type of the field: `string`, `number`, `timestamp`, or `boolean`.
   */
  type: 'string' | 'number' | 'timestamp' | 'boolean';
  /**
   * The user-friendly name used within Zaius. Must be unique across all display names within the object.
   */
  display_name: string;
  /**
   * Description of the field and how it will be referenced in the Zaius UI.
   * While optional, it's use is strongly encouraged.
   */
  description?: string;
  /**
   * Used when creating new objects to denote this field should be used as the primary key for the object.
   * Should be undefined or false for all other fields.
   */
  primary_key?: boolean;
}
