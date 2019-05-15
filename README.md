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
