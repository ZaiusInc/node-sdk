process.env = Object.assign(process.env, {
  ZAIUS_SDK_TEST_REQUEST_ID: '00000000-0000-0000-0000-000000000000',
  ZAIUS_SDK_API_KEY: 'private.api_key'
});

// silence expected console.error() uncomment to debug tests with errors
jest.spyOn(global.console, 'error').mockImplementation();
jest.spyOn(global.console, 'debug').mockImplementation();

beforeEach(() => {
  expect.hasAssertions();
});
