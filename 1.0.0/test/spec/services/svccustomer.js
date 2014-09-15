'use strict';

describe('Service: svcCustomer', function () {

  // load the service's module
  beforeEach(module('v100App'));

  // instantiate service
  var svcCustomer;
  beforeEach(inject(function (_svcCustomer_) {
    svcCustomer = _svcCustomer_;
  }));

  it('should do something', function () {
    expect(!!svcCustomer).toBe(true);
  });

});
