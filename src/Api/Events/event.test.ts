import deepFreeze from 'deep-freeze';
import 'jest';
import {ApiV3} from '../lib/ApiV3';
import {EventPayload} from '../Types';
import {event} from './event';
import {InternalConfig} from '../config/configure';

describe('event', () => {
  const mockConfiguration: InternalConfig = {
    apiBasePath: 'https://api.zaius.com/v3/',
    apiKey: 'api-key',
  };
  const apiV3: ApiV3.API = new ApiV3.API(mockConfiguration);
  let postMock!: jest.SpyInstance;
  beforeEach(() => {
    postMock = jest.spyOn(apiV3, 'post').mockReturnValue(Promise.resolve({} as any));
  });

  it('sends a post to /events', async () => {
    const payload = deepFreeze({type: 'pageview', identifiers: {email: 'test@optimizely.com'}, data: {page: 'foo'}});
    await event(apiV3, payload);
    expect(postMock).toHaveBeenCalledWith('/events', payload);
  });

  it('throws an error if too many events are sent in one call', async () => {
    const payload: EventPayload[] = [];
    for (let i = 0; i < ApiV3.BATCH_LIMIT + 1; i++) {
      payload.push({type: 'pageview', identifiers: {email: 'test@optimizely.com'}, data: {page: 'foo'}});
    }

    expect.assertions(2);
    try {
      await event(apiV3, payload);
    } catch (error: any) {
      expect(error.message).toMatch(/maximum batch size/);
      expect(error.code).toEqual(ApiV3.ErrorCode.BatchLimitExceeded);
    }
  });
});
