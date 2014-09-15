'use strict';

describe('Controller: CtrlsmsCtrl', function () {

  // load the controller's module
  beforeEach(module('v100App'));

  var CtrlsmsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CtrlsmsCtrl = $controller('CtrlsmsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
