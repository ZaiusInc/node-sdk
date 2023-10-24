A lightweight Node SDK for sending events and data to Optimizely Data Platform (ODP) from a Node JavaScript app in Optimizely Connect Platform (OCP).

> 🚧 Warning
> 
> This is _not_ a browser compatible SDK. To interface with ODP from a web site, use the [ODP Web SDK](https://docs.developers.optimizely.com/optimizely-data-platform/docs/get-started-with-web-sdk).

The Node SDK provides interfaces to the majority of [ODP REST APIs](https://docs.developers.optimizely.com/optimizely-data-platform/reference/introduction).

## Get started

Install using [yarn](https://yarnpkg.com/en/):

```bash
yarn add @zaiusinc/node-sdk
```

Or [npm](https://www.npmjs.com/):

```bash
npm install @zaiusinc/node-sdk
```

## Configuration

You need to configure the SDK with your API keys. If you are only sending data to ODP, you normally only need your public API key, however, some API calls require your private API key. You can obtain these from the **Account Settings > APIs** page in the ODP app.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/43ca706-image.png",
        null,
        null
      ],
      "align": "center",
      "border": true
    }
  ]
}
[/block]

```typescript
import {z} from '@zaiusinc/node-sdk';
z.configure({
  apiKey: 'your_public_or_private_api_key'
});
```

## Usage

ODP APIs are exposed through the `z` export:

```javascript
import {z} from '@zaiusinc/node-sdk';

async function pageview(email, page) {
  const event = {type: 'pageview', identifiers: {email}, data: {page}};
  const result = await z.event(event);
  return result.success;
}
```

## Typescript

The OCP Node SDK is typescript first, so you do not need to install or create additional type definitions. To access the exported types, import `Zaius` from the SDK.

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
 * Configure the OCP Node SDK for use
 */
z.configure(sdkConfig);

/**
 * Access public values of the current configuration
 */
z.config;

/**
 * Send an event to ODP using the v3 event API
 */
z.event(eventPayload);
z.event(eventPayload[]);

/**
 * Create or update a customer profile in ODP using the v3 profiles API
 */
z.customer(customerPayload, options);
z.customer(customerPayload[], options);

/**
 * Create or update an object in ODP using the v3 objects API
 */
z.object(type, objectPayload, options);

/**
 * Manage schema (ODP domain objects and fields) using the v3 APIs
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

## Use APIs that the OCP Node SDK does not support

Unfortunately, not every API has a helper in the OCP Node SDK. If you need to use other APIs, follow the [ODP REST API documentation](https://docs.developers.optimizely.com/optimizely-data-platform/reference/introduction) and use the v3API helper to query the APIs directly. For example:

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
