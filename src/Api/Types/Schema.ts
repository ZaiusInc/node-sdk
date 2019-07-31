/**
 * The Zaius Field definition payload for schema APIs.
 * See [V3 Schema API](https://old.developers.zaius.com/v3/reference#create-fields-2) for details.
 */
export interface FieldDefinition {
  /**
   * The name of the field. Lower snake case, alphanumeric, must start with an alpha character.
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

/**
 * The Zaius Object definition payload for schema APIs.
 * See [V3 Schema API](https://old.developers.zaius.com/reference#create-object) for details.
 */
export interface ObjectDefinition {
  /**
   * The name of the object. Lower snake case, alphanumeric, must start with an alpha character. Should be plural.
   * Must be unique across all object names and aliases within the schema.
   */
  name: string;

  /**
   * The user-friendly name used within Zaius. Must be unique across all object display names within the schema.
   */
  display_name: string;

  /**
   * An alias for the object that can be used during ingest. Should be the singular form of the name.
   * Must be unique across all object names and aliases within the schema.
   * Will be automatically derived if not specified.
   */
  alias?: string;

  /**
   * Initial list of field definitions. Must at least contain a primary key field.
   */
  fields: FieldDefinition[];

  /**
   * Initial list of relation definitions, if any.
   */
  relations?: RelationDefinition[];
}

/**
 * The Zaius Relation definition payload for schema APIs.
 * See [V3 Schema API](https://old.developers.zaius.com/v3/reference#relationships) for details.
 */
export interface RelationDefinition {
  /**
   * The name of the relation. Lower snake case, alphanumeric, must start with an alpha character.
   * Must be unique across all relation and field names within the object.
   */
  name: string;
  /**
   * The user-friendly name used within Zaius.
   * Must be unique across all relation and field display names within the object.
   */
  display_name: string;
  /**
   * The child or "target" object of this relation.
   */
  child_object: string;
  /**
   * Collection of parent/child field pairs that define how to join the parent object to the child object.
   * Multiple pairs are allowed to support objects with compound primary keys.
   */
  join_fields: JoinField[];
}

/**
 * Datatype representing the fields on which to join for a relation.
 */
interface JoinField {
  /**
   * The field name on the parent or "source" object.
   */
  parent: string;
  /**
   * The field name on the child or "target" object.
   */
  child: string;
}
