import 'jest';
import {joinUri} from './joinUri';

describe('joinUri', () => {
  it('combines uri parts', () => {
    expect(joinUri('http://foo', 'bar')).toEqual('http://foo/bar');
    expect(joinUri('http://foo', 'bar', 'baz')).toEqual('http://foo/bar/baz');
  });

  it("doesn't add a path separator when it's not necessary", () => {
    expect(joinUri('http://foo/', 'bar')).toEqual('http://foo/bar');
    expect(joinUri('http://foo', '/bar')).toEqual('http://foo/bar');
    expect(joinUri('http://foo', '/bar/', 'baz')).toEqual('http://foo/bar/baz');
  });

  it('removes a path separator when there is one on both sides of the join', () => {
    expect(joinUri('http://foo/', '/bar/')).toEqual('http://foo/bar/');
  });
});
