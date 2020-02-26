var nonce = require('../index');
var test = require('unit.js');
describe('Nonce Generator', function () {
  it('should return the number of specified characters, exactly', function (done) {
    test.string(nonce(5)).hasLength(5);
    done();
  });
});