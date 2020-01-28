import 'jest';
import * as nock from 'nock';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {ConsentUpdate} from '../Types';
import {getConsent, updateConsent} from './consent';
import deepFreeze = require('deep-freeze');

const mockConfiguration: InternalConfig = {
  trackerId: 'vdl',
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key'
};

describe('consent', () => {
  beforeAll(() => {
    ApiV3.configure(mockConfiguration);
  });

  describe('updateConsent', () => {
    it('sends a post to /consent', async () => {
      const update: ConsentUpdate = Object.freeze({
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        consent: false,
        consent_update_reason: 'preference center update'
      });
      nock('https://api.zaius.com')
        .post('/v3/consent', [update] as any)
        .reply(200, '{}');
      await updateConsent(update);
      expect(nock.isDone()).toBeTruthy();
    });

    it('handles multiple updates', async () => {
      const update = deepFreeze([
        {
          identifier_field_name: 'email',
          identifier_value: 'foo@zaius.com',
          consent: false,
          consent_update_reason: 'preference center update'
        },
        {
          identifier_field_name: 'email',
          identifier_value: 'bar@zaius.com',
          consent: false,
          consent_update_reason: 'other'
        }
      ]) as ConsentUpdate[];
      nock('https://api.zaius.com')
        .post('/v3/consent', update as any)
        .reply(200, '{}');
      await updateConsent(update);
      expect(nock.isDone()).toBeTruthy();
    });

    it('throws an error if the api returns an error', async () => {
      const update: ConsentUpdate = {
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        consent: false
      };
      nock('https://api.zaius.com')
        .post('/v3/consent', [update] as any)
        .reply(400, '{}');
      await expect(updateConsent(update)).rejects.toThrowError('Bad Request');
      expect(nock.isDone()).toBeTruthy();
    });

    it('throws an error if the batch is too large', async () => {
      const updates = Array(101).fill({
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        consent: true
      });
      await expect(updateConsent(updates)).rejects.toThrowError('maximum batch size');
    });

    it('formats date if provided as a Date object', async () => {
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce('2020-01-21T23:07:54.373Z');
      const update: ConsentUpdate = Object.freeze({
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        consent: false,
        consent_update_reason: 'preference center update',
        consent_update_ts: new Date()
      });
      const expectedUpdate: ConsentUpdate = {
        ...update,
        consent_update_ts: '2020-01-21T23:07:54.373Z'
      };
      nock('https://api.zaius.com')
        .post('/v3/consent', [expectedUpdate] as any)
        .reply(200, '{}');
      await updateConsent(update);
      expect(nock.isDone()).toBeTruthy();
    });
  });

  describe('getConsent', () => {
    it('sends a get to /reachability/{identifier}', async () => {
      nock('https://api.zaius.com')
        .get('/v3/consent/email?id=foo%40zaius.com')
        .reply(200, '{}');
      await getConsent('email', 'foo@zaius.com');
      expect(nock.isDone()).toBeTruthy();
    });

    it('safely encodes url values', async () => {
      nock('https://api.zaius.com')
        .get('/v3/consent/em%20ail?id=%22foo%22%40zaius.com')
        .reply(200, '{}');
      await getConsent('em ail', '"foo"@zaius.com');
      expect(nock.isDone()).toBeTruthy();
    });
  });
});
