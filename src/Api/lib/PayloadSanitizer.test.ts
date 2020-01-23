import {PayloadSanitizer} from './PayloadSanitizer';

describe('PayloadSanitizer', () => {
  describe('sanitize', () => {
    let fixture = {};
    beforeEach(
      () =>
        (fixture = {
          empty: '',
          blank: '   ',
          nullified: null,
          value: 'value'
        })
    );

    it('by default should trimToNull and excludeNulls', async () => {
      PayloadSanitizer.sanitize(fixture);
      expect(fixture).toEqual({value: 'value'});
    });

    it('should trimToNull and not excludeNulls', async () => {
      PayloadSanitizer.sanitize(fixture, {excludeNulls: false});
      expect(fixture).toEqual({
        empty: null,
        blank: null,
        nullified: null,
        value: 'value'
      });
    });

    it('should not trimToNull but should excludeNulls', async () => {
      PayloadSanitizer.sanitize(fixture, {trimToNull: false});
      expect(fixture).toEqual({
        empty: '',
        blank: '   ',
        value: 'value'
      });
    });

    it('should not trimToNull or excludeNulls', async () => {
      PayloadSanitizer.sanitize(fixture, {trimToNull: false, excludeNulls: false});
      expect(fixture).toEqual({
        empty: '',
        blank: '   ',
        nullified: null,
        value: 'value'
      });
    });
  });
});
