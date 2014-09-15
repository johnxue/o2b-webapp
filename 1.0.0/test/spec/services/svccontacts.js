'use strict';

describe('Service: svcContacts', function () {

  // load the service's module
  beforeEach(module('v100App'));

  // instantiate service
  var svcContacts;
  beforeEach(inject(function (_svcContacts_) {
    svcContacts = _svcContacts_;
  }));

  it('should do something', function () {
    expect(!!svcContacts).toBe(true);
  });

});
