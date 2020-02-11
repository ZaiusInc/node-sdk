import 'jest';
import * as nock from 'nock';
import {InternalConfig} from '../config/configure';
import {ApiV3} from '../lib/ApiV3';
import {ReachabilityUpdate} from '../Types';
import {getReachability, updateReachability} from './reachability';
import deepFreeze = require('deep-freeze');

const mockConfiguration: InternalConfig = {
  trackerId: 'vdl',
  apiBasePath: 'https://api.zaius.com/v3/',
  apiKey: 'api-key'
};

describe('reachability', () => {
  describe('updateReachability', () => {
    beforeAll(() => {
      ApiV3.configure(mockConfiguration);
    });

    it('sends a post to /reachability', async () => {
      const update: ReachabilityUpdate = Object.freeze({
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        reachable: false,
        reachable_update_reason: 'hard_bounce'
      });
      nock('https://api.zaius.com')
        .post('/v3/reachability', [update] as any)
        .reply(200, '{}');
      await updateReachability(update);
      expect(nock.isDone()).toBeTruthy();
    });

    it('handles multiple updates', async () => {
      const update = deepFreeze([
        {
          identifier_field_name: 'email',
          identifier_value: 'foo@zaius.com',
          reachable: false,
          reachable_update_reason: 'hard_bounce'
        },
        {
          identifier_field_name: 'email',
          identifier_value: 'bar@zaius.com',
          reachable: true,
          reachable_update_reason: 'hard_bounce'
        }
      ]) as ReachabilityUpdate[];
      nock('https://api.zaius.com')
        .post('/v3/reachability', update as any)
        .reply(200, '{}');
      await updateReachability(update);
      expect(nock.isDone()).toBeTruthy();
    });

    it('throws an error if the api returns an error', async () => {
      const update: ReachabilityUpdate = {
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        reachable: false
      };
      nock('https://api.zaius.com')
        .post('/v3/reachability', [update] as any)
        .reply(400, '{}');
      await expect(updateReachability(update)).rejects.toThrowError('Bad Request');
      expect(nock.isDone()).toBeTruthy();
    });

    it('throws an error if the batch is too large', async () => {
      const updates = Array(101).fill({
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        reachable: true
      });
      await expect(updateReachability(updates)).rejects.toThrowError('maximum batch size');
    });

    it('converts date if provided as a Date object', async () => {
      jest.spyOn(Date.prototype, 'getTime').mockReturnValueOnce(1579648074373);
      const update: ReachabilityUpdate = Object.freeze({
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        reachable: false,
        reachable_update_reason: 'preference center update',
        reachable_update_ts: new Date()
      });
      const expectedUpdate: ReachabilityUpdate = {
        ...update,
        reachable_update_ts: 1579648074
      };
      nock('https://api.zaius.com')
        .post('/v3/reachability', [expectedUpdate] as any)
        .reply(200, '{}');
      await updateReachability(update);
      expect(nock.isDone()).toBeTruthy();
    });

    it('converts date if provided as an string', async () => {
      jest.spyOn(Date.prototype, 'getTime').mockReturnValueOnce(1579648074373);
      const update: ReachabilityUpdate = Object.freeze({
        identifier_field_name: 'email',
        identifier_value: 'foo@zaius.com',
        reachable: false,
        reachable_update_reason: 'preference center update',
        reachable_update_ts: '2020-01-21T23:07:54.373Z'
      });
      const expectedUpdate: ReachabilityUpdate = {
        ...update,
        reachable_update_ts: 1579648074
      };
      nock('https://api.zaius.com')
        .post('/v3/reachability', [expectedUpdate] as any)
        .reply(200, '{}');
      await updateReachability(update);
      expect(nock.isDone()).toBeTruthy();
    });
  });

  describe('getReachability', () => {
    it('sends a get to /reachability/{identifier}', async () => {
      nock('https://api.zaius.com')
        .get('/v3/reachability/email?id=foo%40zaius.com')
        .reply(200, '{}');
      await getReachability('email', 'foo@zaius.com');
      expect(nock.isDone()).toBeTruthy();
    });

    it('safely encodes url values', async () => {
      nock('https://api.zaius.com')
        .get('/v3/reachability/em%20ail?id=%22foo%22%40zaius.com')
        .reply(200, '{}');
      await getReachability('em ail', '"foo"@zaius.com');
      expect(nock.isDone()).toBeTruthy();
    });
  });
});
