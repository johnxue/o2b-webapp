'use strict';

describe('Service: svcTask', function () {

  // load the service's module
  beforeEach(module('v100App'));

  // instantiate service
  var svcTask;
  beforeEach(inject(function (_svcTask_) {
    svcTask = _svcTask_;
  }));

  it('should do something', function () {
    expect(!!svcTask).toBe(true);
  });

});
