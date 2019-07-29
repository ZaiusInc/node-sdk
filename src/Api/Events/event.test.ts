import * as deepFreeze from 'deep-freeze';
import 'jest';
import {ApiV3} from '../lib/ApiV3';
import {Event} from '../Types';
import {event} from './event';

describe('event', () => {
  let postMock!: jest.Mock;
  beforeEach(() => {
    postMock = jest.spyOn(ApiV3, 'post').mockReturnValue(Promise.resolve({} as any));
  });

  it('sends a post to /events', async () => {
    const payload = deepFreeze({type: 'pageview', identifiers: {email: 'test@zaius.com'}, data: {page: 'foo'}});
    await event(payload);
    expect(postMock).toHaveBeenCalledWith('/events', payload);
  });

  it('throws an error if too many events are sent in one call', async () => {
    const payload: Event[] = [];
    for (let i = 0; i < ApiV3.BATCH_LIMIT + 1; i++) {
      payload.push({type: 'pageview', identifiers: {email: 'test@zaius.com'}, data: {page: 'foo'}});
    }

    expect.assertions(2);
    try {
      await event(payload);
    } catch (error) {
      expect(error.message).toMatch(/maximum batch size/);
      expect(error.code).toEqual(ApiV3.ErrorCode.BatchLimitExceeded);
    }
  });
});
