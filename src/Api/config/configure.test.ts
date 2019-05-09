import 'jest';
import {ApiV3} from '../lib/ApiV3';
import {config, configure} from './configure';

jest.mock('./ApiV3');

describe('configure', () => {
  it('configures the api module', () => {
    const configuration = {
      trackerId: 'tracker',
      apiBasePath: 'https://api.zaius.com/v3/',
      publicApiKey: 'pub_api_key'
    };

    configure(configuration);

    expect(ApiV3.configure).toHaveBeenCalledWith(configuration);
  });

  it('exposes the tracker id', () => {
    const configuration = {
      trackerId: 'my_tracker_id',
      apiBasePath: 'https://api.zaius.com/v3/',
      publicApiKey: 'pub_api_key'
    };

    configure(configuration);

    expect(config.trackerId).toEqual('my_tracker_id');
  });
});
