'use strict';

describe('Service: svcPotential', function () {

  // load the service's module
  beforeEach(module('v100App'));

  // instantiate service
  var svcPotential;
  beforeEach(inject(function (_svcPotential_) {
    svcPotential = _svcPotential_;
  }));

  it('should do something', function () {
    expect(!!svcPotential).toBe(true);
  });

});
