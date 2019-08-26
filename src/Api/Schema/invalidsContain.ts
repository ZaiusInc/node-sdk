import {ApiV3} from '../lib/ApiV3';
import V3InvalidSchemaDetail = ApiV3.V3InvalidSchemaDetail;

export function invalidsContain(
  invalids: V3InvalidSchemaDetail[] | undefined,
  field: string,
  matcher: (reason: string) => boolean
): boolean {
  if (invalids) {
    return invalids.some((detail) => {
      if (detail.field === field) {
        if (detail.reason instanceof Array) {
          return detail.reason.some(matcher);
        }
        return matcher(detail.reason);
      }
      return false;
    });
  }
  return false;
}
