'use strict';

describe('Controller: CtrlpotentialCtrl', function () {

  // load the controller's module
  beforeEach(module('v100App'));

  var CtrlpotentialCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CtrlpotentialCtrl = $controller('CtrlpotentialCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
