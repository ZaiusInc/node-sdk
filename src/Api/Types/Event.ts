import {FieldValue} from './FieldValue';

type NestedFieldValue = FieldValue | NestedObject | NestedObject[];

interface NestedObject {
  [field: string]: NestedFieldValue;
}

export type EventData = NestedObject;

export interface Event {
  type: string;
  action?: string;
  identifiers: {
    email?: string;
    vuid?: string;
    [field: string]: string | undefined;
  };
  data: EventData;
}
