'use strict';

describe('Service: svcDocumnet', function () {

  // load the service's module
  beforeEach(module('v100App'));

  // instantiate service
  var svcDocumnet;
  beforeEach(inject(function (_svcDocumnet_) {
    svcDocumnet = _svcDocumnet_;
  }));

  it('should do something', function () {
    expect(!!svcDocumnet).toBe(true);
  });

});
