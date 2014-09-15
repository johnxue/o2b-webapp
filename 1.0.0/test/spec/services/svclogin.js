'use strict';

describe('Service: svcLogin', function () {

  // load the service's module
  beforeEach(module('v100App'));

  // instantiate service
  var svcLogin;
  beforeEach(inject(function (_svcLogin_) {
    svcLogin = _svcLogin_;
  }));

  it('should do something', function () {
    expect(!!svcLogin).toBe(true);
  });

});
