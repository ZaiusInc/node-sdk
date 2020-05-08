import 'jest';
import {ApiV3} from '../lib/ApiV3';
import {configure} from './configure';

jest.mock('../lib/ApiV3');

describe('configure', () => {
  it('configures the api module', () => {
    const configuration = {
      apiBasePath: 'https://api.zaius.com/v3/',
      apiKey: 'pub_api_key'
    };

    configure(configuration);

    // set by setup.ts
    const defaultConfig = {
      requestId: '00000000-0000-0000-0000-000000000000',
      apiKey: 'private.api_key'
    };
    expect(ApiV3.configure).toHaveBeenCalledWith(Object.assign(defaultConfig, configuration));
  });
});
