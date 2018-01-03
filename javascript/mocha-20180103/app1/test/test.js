const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
      expect(1).to.eq(1);
    });
  });
});
