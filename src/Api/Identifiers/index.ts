import {ApiV3} from '../lib/ApiV3';
import {
  ConsentUpdate,
  GetConsentResponse,
  GetReachabilityResponse,
  IdentifierMetadata,
  IdentifierMetadataResponse,
  ReachabilityUpdate
} from '../Types';

export interface Identifier {
  getMetadata:
  (identifierFieldName: string, identifierValue: string) => Promise<ApiV3.HttpResponse<IdentifierMetadataResponse>>;
  updateMetadata:
  (updates: IdentifierMetadata | IdentifierMetadata[] ) => Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>>;
  getReachability: (identifierName: string, value: string) => Promise<ApiV3.HttpResponse<GetReachabilityResponse>>;
  updateReachability:
  (updates: ReachabilityUpdate | ReachabilityUpdate[]) => Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>>;
  getConsent: (identifierName: string, identifierValue: string) => Promise<ApiV3.HttpResponse<GetConsentResponse>>;
  updateConsent: (updates: ConsentUpdate | ConsentUpdate[]) => Promise<ApiV3.HttpResponse<ApiV3.V3SuccessResponse>>;
}
