# Zaius Node SDK

A lightweight Node SDK for sending events and data to Zaius from a Node JS app.

> <b>⚠️ WARNING: This is NOT a browser compatible SDK.</b><br />
> To interface with Zaius from a web site, use our [Web SDK](https://docs.developers.zaius.com/web-sdk/)

## Documentation

See the generated [Technical Documentation](https://node-sdk.docs.developers.zaius.com/latest/) for details on every method.

The Node SDK provides interfaces to the majority of [Zaius Rest APIs](https://docs.developers.zaius.com/api/). See the Rest API Documentation for details behind each API.

## Getting Started

Install using [yarn](https://yarnpkg.com/en/):

```bash
yarn add @zaiusinc/node-sdk
```

Or [npm](https://www.npmjs.com/):

```bash
npm install @zaiusinc/node-sdk
```

## Configuration

You'll need to configure the SDK with your API keys. If you are only sending data to Zaius, you normally only need your public API key, however, some API calls will require your private API key. These can be obtained from the [APIs page](https://app.zaius.com/#/api_management) in the Zaius app.

```typescript
import {z} from '@zaiusinc/node-sdk';
z.configure({
  apiKey: 'your_public_or_private_api_key'
});
```

## Usage

Zaius APIs are exposed through the `z` export:

```javascript
import {z} from '@zaiusinc/node-sdk';

async function pageview(email, page) {
  const event = {type: 'pageview', identifiers: {email}, data: {page}};
  const result = await z.event(event);
  return result.success;
}
```

## Typescript

Our SDK is typescript first, so no need to install or create additional type definitions.
To access the exported types, import `Zaius` from the sdk.

```typescript
import {z, Zaius} from '@zaiusinc/node-sdk';

async function pageview(email: string, page: string) {
  const event: Zaius.Event = {type: 'pageview', identifiers: {email}, data: {page}};
  const result = await z.event(event);
  return result.success;
}
```

## Available APIs

```javascript
import {z} from '@zaiusinc/node-sdk';

/**
 * Configure the Zaius SDK for use
 */
z.configure(sdkConfig);

/**
 * Access public values of the current configuration
 */
z.config;

/**
 * Send an event to Zaius using the v3 event API
 */
z.event(eventPayload);
z.event(eventPayload[]);

/**
 * Create or Update a customer profile in Zaius using the v3 profiles API
 */
z.customer(customerPayload, options);
z.customer(customerPayload[], options);

/**
 * Create or Update an object in Zaius using the v3 objects API
 */
z.object(type, objectPayload, options);

/**
 * Manage schema (Zaius domain objects and fields) using the v3 APIs
 */
z.schema.createField(object, field);
z.schema.createIdentifier(identifier);
z.schema.getEnabledModules();
z.schema.enableModule(moduleName);
z.schema.getObject(name);
z.schema.getAllObjects();
z.schema.createObject(objectDefinition);
z.schema.createRelation(object, relationDefinition);

/**
 * Manage customer identifiers using the v3 APIs
 */
z.identifier.updateMetadata(identifierUpdates);
z.identifier.getMetadata(identifierFieldName, identifierValue);
z.identifier.updateReachability(reachabilityUpdates);
z.identifier.getReachability(identifierFieldName, identifierValue);
z.identifier.updateConsent(consentUpdates);
z.identifier.getConsent(identifierFieldName, identifierValue);

/**
 * Manage list subscriptions using the v3 APIs
 */
z.list.createList(listName);
z.list.getLists(listName);
z.list.subscribe(listId, identifiers);
z.list.unsubscribe(listId, identifiers);
z.list.updateSubscriptions(listId, arrayOfUpdates);

/**
 * Query data using the GraphQL API
 */
z.graphql<ResponseType>(query, variables);
```

## Using new APIs or APIs not yet supported by the Node SDK

Unfortunately not every API has a helper in the Node SDK. If you need to use other APIs, you can
follow the [Zaius Rest API](https://docs.developers.zaius.com/api/) documentation
and use the v3API helper to query the APIs directly. For example:

```typescript
await z.v3Api.post('objects/products', [
  {
    product_id: '123',
    name: 'Red Shirt'
  },
  {
    product_id: '456',
    name: 'Blue Shirt'
  }
]);
```
