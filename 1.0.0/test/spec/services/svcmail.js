'use strict';

describe('Service: svcMail', function () {

  // load the service's module
  beforeEach(module('v100App'));

  // instantiate service
  var svcMail;
  beforeEach(inject(function (_svcMail_) {
    svcMail = _svcMail_;
  }));

  it('should do something', function () {
    expect(!!svcMail).toBe(true);
  });

});
