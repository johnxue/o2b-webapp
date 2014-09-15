'use strict';

describe('Service: svcSMS', function () {

  // load the service's module
  beforeEach(module('v100App'));

  // instantiate service
  var svcSMS;
  beforeEach(inject(function (_svcSMS_) {
    svcSMS = _svcSMS_;
  }));

  it('should do something', function () {
    expect(!!svcSMS).toBe(true);
  });

});
