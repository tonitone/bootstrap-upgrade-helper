var expect = require('expect.js'),
    bootstrapUpgradeFromV3ToV4 = require('..');

describe('bootstrap-upgrade-from-v-3-to-v-4', function() {
  it('should say hello', function(done) {
    expect(bootstrapUpgradeFromV3ToV4()).to.equal('Hello, world');
    done();
  });
});
