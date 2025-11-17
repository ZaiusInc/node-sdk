import { IdentifierApi } from './IdentifierApi';
import { vi } from 'vitest';
import { ODPClient } from './index';
import { ConsentUpdate, IdentifierMetadata, ReachabilityUpdate } from './Types';
import * as metadata from './Identifiers/identifiers';
import * as reachability from './Identifiers/reachability';
import * as consent from './Identifiers/consent';

describe('IdentifierApi', () => {
  let identifierApi: IdentifierApi;
  let odpClient: ODPClient;

  beforeEach(() => {
    odpClient = new ODPClient();
    identifierApi = new IdentifierApi(odpClient);
  });

  it('should get consent',
    async () => {
      vi.spyOn(consent, 'getConsent').mockReturnValue(Promise.resolve({} as any));

      const identifierName = 'testName';
      const identifierValue = 'testValue';
      await identifierApi.getConsent(identifierName, identifierValue);
      expect(consent.getConsent).toHaveBeenCalledWith(odpClient.v3Api, identifierName, identifierValue);
    });

  it('should get metadata', async () => {
    vi.spyOn(metadata, 'getMetadata').mockReturnValue(Promise.resolve({} as any));

    const identifierFieldName = 'testField';
    const identifierValue = 'testValue';
    await identifierApi.getMetadata(identifierFieldName, identifierValue);
    expect(metadata.getMetadata).toHaveBeenCalledWith(odpClient.v3Api, identifierFieldName, identifierValue);
  });

  it('should get reachability', async () => {
    vi.spyOn(reachability, 'getReachability').mockReturnValue(Promise.resolve({} as any));

    const identifierName = 'testName';
    const value = 'testValue';
    await identifierApi.getReachability(identifierName, value);
    expect(reachability.getReachability).toHaveBeenCalledWith(odpClient.v3Api, identifierName, value);
  });

  it('should update consent', async () => {
    vi.spyOn(consent, 'updateConsent').mockReturnValue(Promise.resolve({} as any));

    const updates: ConsentUpdate = {
      identifier_field_name: '',
      identifier_value: '',
      consent: false
    };
    await identifierApi.updateConsent(updates);
    expect(consent.updateConsent).toHaveBeenCalledWith(odpClient.v3Api, updates);
  });

  it('should update metadata', async () => {
    vi.spyOn(metadata, 'updateMetadata').mockReturnValue(Promise.resolve({} as any));

    const updates: IdentifierMetadata = {
      identifier_field_name: '',
      identifier_value: '',
      metadata: {}
    };
    await identifierApi.updateMetadata(updates);
    expect(metadata.updateMetadata).toHaveBeenCalledWith(odpClient.v3Api, updates);
  });

  it('should update reachability', async () => {
    vi.spyOn(reachability, 'updateReachability').mockReturnValue(Promise.resolve({} as any));

    const updates: ReachabilityUpdate = {
      identifier_field_name: '',
      identifier_value: '',
      reachable: false
    };
    await identifierApi.updateReachability(updates);
    expect(reachability.updateReachability).toHaveBeenCalledWith(odpClient.v3Api, updates);
  });
});
