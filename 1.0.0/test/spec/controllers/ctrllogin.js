'use strict';

describe('Controller: CtrlloginCtrl', function () {

  // load the controller's module
  beforeEach(module('v100App'));

  var CtrlloginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CtrlloginCtrl = $controller('CtrlloginCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
