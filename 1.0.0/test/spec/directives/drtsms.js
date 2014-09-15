'use strict';

describe('Directive: drtSMS', function () {

  // load the directive's module
  beforeEach(module('v100App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drt-s-m-s></drt-s-m-s>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the drtSMS directive');
  }));
});
