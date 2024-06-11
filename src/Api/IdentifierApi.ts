import {Identifier} from './Identifiers';
import {ApiV3} from './lib/ApiV3';
import {
  ConsentUpdate,
  GetConsentResponse,
  GetReachabilityResponse,
  IdentifierMetadata,
  IdentifierMetadataResponse,
  ReachabilityUpdate
} from './Types';
import {ODPClient} from './index';
import {getConsent, updateConsent} from './Identifiers/consent';
import {getMetadata, updateMetadata} from './Identifiers/identifiers';
import {getReachability, updateReachability} from './Identifiers/reachability';

export class IdentifierApi implements Identifier {

  public constructor(private client: ODPClient){
  }

  public getConsent(identifierName: string, identifierValue: string): Promise<ApiV3.HttpResponse<GetConsentResponse>> {
    return getConsent(this.client.v3Api, identifierName, identifierValue);
  }

  public getMetadata = (
    identifierFieldName: string,
    identifierValue: string
  ): Promise<ApiV3.HttpResponse<IdentifierMetadataResponse>> => getMetadata(
    this.client.v3Api,
    identifierFieldName,
    identifierValue
  );


  public getReachability = (
    identifierName: string,
    value: string
  ): Promise<ApiV3.HttpResponse<GetReachabilityResponse>> => getReachability(this.client.v3Api, identifierName, value);


  public updateConsent = (
    updates: ConsentUpdate | ConsentUpdate[]
  ): Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>>  => updateConsent(this.client.v3Api, updates);

  public updateMetadata = (
    updates: IdentifierMetadata | IdentifierMetadata[]
  ): Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>> => updateMetadata(this.client.v3Api, updates);

  public updateReachability = (
    updates: ReachabilityUpdate | ReachabilityUpdate[]
  ): Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>> => updateReachability(this.client.v3Api, updates);

}
