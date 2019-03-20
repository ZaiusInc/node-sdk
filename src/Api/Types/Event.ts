import {FieldValue} from './FieldValue';

export interface Event {
  type: string;
  action?: string;
  identifiers: {[field: string]: string};
  data: {[field: string]: FieldValue};
}
