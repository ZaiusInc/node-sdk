/**
 * The ODP Field definition payload for schema APIs.
 * See [V3 Schema API](https://docs.developers.optimizely.com/optimizely-data-platform/reference/create-field-1)
 * for details.
 */
export interface FieldDefinition {
  /**
   * The name of the field. Lower snake case, alphanumeric, must start with an alpha character.
   * Must be unique across all field names within the object.
   */
  name: string;
  /**
   * The type of the field: `string`, `number`, `timestamp`, `boolean` or `vector`.
   */
  type: 'string' | 'number' | 'timestamp' | 'boolean' | 'vector';
  /**
   * The user-friendly name used within ODP. Must be unique across all display names within the object.
   */
  display_name: string;
  /**
   * Description of the field and how it will be referenced in the ODP UI.
   * While optional, it's use is strongly encouraged.
   */
  description?: string;
  /**
   * Used when creating new objects to denote this field should be used as the primary key for the object.
   * Should be undefined or false for all other fields.
   */
  primary?: boolean;
}

/**
 * The ODP Object definition payload for schema APIs.
 * See [V3 Schema API](https://docs.developers.optimizely.com/optimizely-data-platform/reference/create-object-1)
 * for details.
 */
export interface ObjectDefinition {
  /**
   * The name of the object. Lower snake case, alphanumeric, must start with an alpha character. Should be plural.
   * Must be unique across all object names and aliases within the schema.
   */
  name: string;

  /**
   * The user-friendly name used within ODP. Must be unique across all object display names within the schema.
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
 * The ODP Relation definition payload for schema APIs.
 * See [V3 Schema API](https://docs.developers.optimizely.com/optimizely-data-platform/reference/create-relationship-1)
 * for details.
 */
export interface RelationDefinition {
  /**
   * The name of the relation. Lower snake case, alphanumeric, must start with an alpha character.
   * Must be unique across all relation and field names within the object.
   */
  name: string;
  /**
   * The user-friendly name used within ODP.
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

/**
 * Response format for a successful get or post to the V3 Modules API.
 */
export interface ModulesResponse {
  enabled_modules: string[];
}

/**
 * The ODP Identifier definition payload for schema API.
 * See [V3 Schema API](https://docs.developers.optimizely.com/optimizely-data-platform/reference/create-identifier-1)
 * for details.
 */
export interface IdentifierDefinition {
  /**
   * The field name of the identifier, ending with one of the known suffixes: "_id", "_hash", "_number", "_token",
   * "_alias", "_address", or "_key".
   */
  name: string;
  /**
   * The human-readable name, ending with title-case version of the name suffix: " ID", " Hash", " Number", " Token",
   * " Alias", " Address", or " Key".
   */
  display_name: string;
  /**
   * The level of confidence that this identifier can be used to merge customer profiles together. If the identifier
   * is likely to be shared between individuals (eg, a shared device token), this value should be set to "low". If it
   * is very deterministic (eg, a personal account ID), this value should be set to "high".
   */
  merge_confidence: 'low' | 'high';
  /**
   * Whether this identifier can be used to message customers within campaigns.
   */
  messaging?: boolean;
}

/**
 * Response format for a successful post to the V3 Identifiers API.
 */
export interface CreateIdentifierResponse {
  /**
   * The fields that were added to the Events object as a result of creating the identifier.
   */
  events: FieldDefinition[];
  /**
   * The fields that were added to the Customers object as a result of creating the identifier.
   */
  customers: FieldDefinition[];
}
