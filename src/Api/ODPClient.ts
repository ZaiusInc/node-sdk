import {Schema} from './Schema';
import {Identifier} from './Identifiers';
import {Lists} from './List';
import {ApiV3} from './lib/ApiV3';
import {Config, InternalConfig} from './config/configure';
import {IdentifierApi} from './IdentifierApi';
import {SchemaApi} from './SchemaApi';
import {ListsApi} from './ListsApi';
import {
  CustomerPayload,
  CustomerResponse,
  EventPayload,
  EventResponse,
  ObjectPayload,
  ObjectResponse,
  PayloadOptions
} from './Types';
import {GqlHttpResponse} from './Types/GraphQL';
import { event } from './Events/event';
import { customer } from './Customers/customer';
import { object } from './Objects/object';
import { graphql } from './GraphQL/graphql';

export class ODPClient {
  /**
   * Manage schema (ODP domain objects and fields) using the v3 APIs
   */
  public schema: Schema;

  /**
   * Manage customer identifiers using the v3 APIs
   */
  public identifier: Identifier;

  /**
   * Manage list subscriptions using the v3 APIs
   */
  public list: Lists;

  /**
   * Direct access to query any API by path using the v3 API helper
   */
  public v3Api: ApiV3.API;

  public constructor(config: Config | InternalConfig | null = null) {
    this.v3Api = new ApiV3.API(config);
    this.identifier = new IdentifierApi(this);
    this.schema = new SchemaApi(this);
    this.list = new ListsApi(this);
  }

  /**
   * Send an event to ODP using the v3 event API
   */
  public event = (
    payload: EventPayload | EventPayload[]
  ): Promise<ApiV3.HttpResponse<EventResponse>> => event(this.v3Api, payload);

  /**
   * Create or Update a customer profile in ODP using the v3 profiles API
   */
  public customer = (
    payload: CustomerPayload | CustomerPayload[],
    opts?: PayloadOptions
  ): Promise<ApiV3.HttpResponse<CustomerResponse>> => customer(this.v3Api, payload, opts);

  /**
   * Create or Update an object in ODP using the v3 objects API
   */
  public object = (
    type: string,
    payload: ObjectPayload | ObjectPayload[],
    opts?: PayloadOptions
  ): Promise<ApiV3.HttpResponse<ObjectResponse>> =>  object(this.v3Api, type, payload, opts);

  /**
   * Query data using the GraphQL API
   */
  public graphql = <T extends ApiV3.V3Response> (
    query: string,
    variables?: { [key: string]: any }
  ): Promise<GqlHttpResponse<T>> => graphql(this.v3Api, query, variables);
}
