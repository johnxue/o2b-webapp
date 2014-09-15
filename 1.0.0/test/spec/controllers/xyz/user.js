'use strict';

describe('Controller: XyzUserCtrl', function () {

  // load the controller's module
  beforeEach(module('v100App'));

  var XyzUserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    XyzUserCtrl = $controller('XyzUserCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
