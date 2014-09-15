'use strict';

describe('Controller: CtrlcustomerCtrl', function () {

  // load the controller's module
  beforeEach(module('v100App'));

  var CtrlcustomerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CtrlcustomerCtrl = $controller('CtrlcustomerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
