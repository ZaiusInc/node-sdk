import {ODPClient} from './index';
import {CustomerPayload, EventPayload, ObjectPayload} from './Types';
import * as events from './Events/event';
import * as customers from './Customers/customer';
import * as objects from './Objects/object';
import * as graphql from './GraphQL/graphql';

describe('ODPClient', () => {
  let odpClient: ODPClient;

  beforeEach(() => {
    odpClient = new ODPClient();
  });

  it('should send event',
    async () => {
      jest.spyOn(events, 'event').mockReturnValue(Promise.resolve({} as any));

      const payload: EventPayload = {
        data: {},
        identifiers: {},
        type: 'order'
      };
      await odpClient.event(payload);
      expect(events.event).toHaveBeenCalledWith(odpClient.v3Api, payload);
    });

  it('should send customer',
    async () => {
      jest.spyOn(customers, 'customer').mockReturnValue(Promise.resolve({} as any));

      const payload: CustomerPayload = {
        attributes: {}, identifiers: {}
      };
      await odpClient.customer(payload);
      expect(customers.customer).toHaveBeenCalledWith(odpClient.v3Api, payload, undefined);
    });

  it('should send object',
    async () => {
      jest.spyOn(objects, 'object').mockReturnValue(Promise.resolve({} as any));

      const payload: ObjectPayload = {
        type: 'order'
      };
      const type = 'testType';
      await odpClient.object(type, payload);
      expect(objects.object).toHaveBeenCalledWith(odpClient.v3Api, type, payload, undefined);
    });

  it('should send graphql query',
    async () => {
      jest.spyOn(graphql, 'graphql').mockReturnValue(Promise.resolve({} as any));

      const query = 'test query';
      await odpClient.graphql(query);
      expect(graphql.graphql).toHaveBeenCalledWith(odpClient.v3Api, query, undefined);
    });

});
