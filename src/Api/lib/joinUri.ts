/**
 * Join URI parts with / between each part
 * e.g. joinUrl('http://foo.bar', 'baz') => 'http://foo.bar/baz'
 * @param parts to join
 */
export function joinUri(...parts: string[]) {
  let uri = '';
  parts.forEach((part: string, index: number) => {
    if (index > 0) {
      if (uri.endsWith('/') && part.startsWith('/')) {
        uri = uri.slice(0, uri.length - 1);
      } else if (!uri.endsWith('/') && !part.startsWith('/')) {
        uri += '/';
      }
    }
    uri += part;
  });

  return uri;
}
