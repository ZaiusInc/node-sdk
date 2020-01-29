# Zaius Node SDK

Send events and data to Zaius from Node JS.

## Getting Started

Install using [yarn](https://yarnpkg.com/en/):

```bash
yarn add @zaius/node-sdk
```

Or [npm](https://www.npmjs.com/):

```bash
npm install @zaius/node-sdk
```

## Usage

Zaius APIs are exposed through the `z` export:

```javascript
import {z} from '@zaius/node-sdk';

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
import {z, Zaius} from '@zaius/node-sdk';

async function pageview(email: string, page: string) {
  const event: Zaius.Event = {type: 'pageview', identifiers: {email}, data: {page}};
  const result = await z.event(event);
  return result.success;
}
```

## Available APIs

```javascript
import {z} from '@zaius/node-sdk';

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
```
