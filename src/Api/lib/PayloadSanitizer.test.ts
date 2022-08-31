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

    it('by default should trimToNull and excludeNulls', () => {
      PayloadSanitizer.sanitize(fixture);
      expect(fixture).toEqual({value: 'value'});
    });

    it('should trimToNull and not excludeNulls', () => {
      PayloadSanitizer.sanitize(fixture, {excludeNulls: false});
      expect(fixture).toEqual({
        empty: null,
        blank: null,
        nullified: null,
        value: 'value'
      });
    });

    it('should not trimToNull but should excludeNulls', () => {
      PayloadSanitizer.sanitize(fixture, {trimToNull: false});
      expect(fixture).toEqual({
        empty: '',
        blank: '   ',
        value: 'value'
      });
    });

    it('should not trimToNull or excludeNulls', () => {
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
