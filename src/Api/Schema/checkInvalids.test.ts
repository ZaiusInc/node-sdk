import 'jest';
import {ApiV3} from '../lib/ApiV3';
import {checkInvalids} from './checkInvalids';
import V3InvalidSchemaDetail = ApiV3.V3InvalidSchemaDetail;

describe('checkInvalids', () => {
  const invalids: V3InvalidSchemaDetail[] = [{
    field: 'foo',
    reason: 'bar'
  }, {
    field: 'buzz',
    reason: ['bang', 'boom']
  }, {
    field: 'bar',
    reason: 'foo'
  }, {
    field: 'beep',
    reason: ['bleep', 'jeep']
  }];

  it('matches with a string', () => {
    expect(checkInvalids(invalids, 'bar', (reason) => /^\w+$/.test(reason))).toBe(true);
  });

  it('matches with an array', () => {
    expect(checkInvalids(invalids, 'buzz', (reason) =>  reason === 'boom')).toBe(true);
  });

  it('detects non-match with a string', () => {
    expect(checkInvalids(invalids, 'foo', (reason) => /^\d+$/.test(reason))).toBe(false);
  });

  it('detects non-match with an array', () => {
    expect(checkInvalids(invalids, 'beep', (reason) => reason === 'horn')).toBe(false);
  });
});
