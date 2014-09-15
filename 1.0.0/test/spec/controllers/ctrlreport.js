'use strict';

describe('Controller: CtrlreportCtrl', function () {

  // load the controller's module
  beforeEach(module('v100App'));

  var CtrlreportCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CtrlreportCtrl = $controller('CtrlreportCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
