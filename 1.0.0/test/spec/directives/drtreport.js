'use strict';

describe('Directive: drtreport', function () {

  // load the directive's module
  beforeEach(module('v100App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drtreport></drtreport>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the drtreport directive');
  }));
});
