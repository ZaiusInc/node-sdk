process.env = Object.assign(process.env, {
  ZAIUS_SDK_TRACKER_ID: 'test_tracker_id',
  ZAIUS_SDK_TEST_REQUEST_ID: '00000000-0000-0000-0000-000000000000',
  ZAIUS_SDK_API_KEY: 'private.api_key'
});

// silence expected console.error()
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());

beforeEach(() => {
  expect.hasAssertions();
});
