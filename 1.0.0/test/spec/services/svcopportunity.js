'use strict';

describe('Service: svcOpportunity', function () {

  // load the service's module
  beforeEach(module('v100App'));

  // instantiate service
  var svcOpportunity;
  beforeEach(inject(function (_svcOpportunity_) {
    svcOpportunity = _svcOpportunity_;
  }));

  it('should do something', function () {
    expect(!!svcOpportunity).toBe(true);
  });

});
