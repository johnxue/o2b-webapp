'use strict';

describe('Service: svcReport', function () {

  // load the service's module
  beforeEach(module('v100App'));

  // instantiate service
  var svcReport;
  beforeEach(inject(function (_svcReport_) {
    svcReport = _svcReport_;
  }));

  it('should do something', function () {
    expect(!!svcReport).toBe(true);
  });

});
