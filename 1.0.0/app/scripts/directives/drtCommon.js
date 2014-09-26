/**
 * Created by yuzhenhan on 14-9-26.
 */

var CommonDirectives = angular.module('CommonDirectives', []);

//var EMAIL_REGEXP = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
//var MOBILE_REGEXP= /^0?(13|15|18|17)[0-9]{9}$/;

var EMAIL_AND_MOBILE_REGEXP=/[^\._-][\w\.-]+@(?:[A-Za-z0-9]+\.)+[A-Za-z]+$|^0\d{2,3}\d{7,8}$|^1[358]\d{9}$|^147\d{8}/;

CommonDirectives.directive('emailmobile', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                // 匹配email&mobile
                if (EMAIL_AND_MOBILE_REGEXP.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('emailmobile', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('emailmobile', false);
                    return undefined;
                }
            });
        }
    };
});

//判断俩个值是否为不同的
CommonDirectives.directive('repeat', [function() {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function (scope, element, attrs, ctrl) {
            if (ctrl) {
                var otherInput = element.inheritedData("$formController")[attrs.repeat];

                var repeatValidator = function (value) {
                    var validity = value === otherInput.$viewValue;
                    ctrl.$setValidity("repeat", validity);
                    return validity ? value : undefined;
                };

                ctrl.$parsers.push(repeatValidator);
                ctrl.$formatters.push(repeatValidator);

                otherInput.$parsers.push(function (value) {
                    ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                    return value;
                });
            }
        }

    }
}]);

//判断俩个值是否为相同的
CommonDirectives.directive('same', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            if (ctrl) {
                var otherInput = element.inheritedData("$formController")[attrs.same];

                var sameValidator = function (value) {
                    var validity = value !== otherInput.$viewValue;
                    ctrl.$setValidity("same", validity);
                    return validity ? value : undefined;
                };

                ctrl.$parsers.push(sameValidator);
                ctrl.$formatters.push(sameValidator);

                otherInput.$parsers.push(function (value) {
                    ctrl.$setValidity("same", value !== ctrl.$viewValue);
                    return value;
                });
            }
        }
    };
});

//判断值的长度是否大于20
CommonDirectives.directive('gttwenty', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs,ctrl) {
               if(ctrl){
                var gttwentyValidator = function (value) {
                    var validity = (value.length>20);
                    ctrl.$setValidity("gttwenty", !validity);
                    return validity ? undefined : value ;
                };
                ctrl.$parsers.push(gttwentyValidator);
                ctrl.$formatters.push(gttwentyValidator);
               }
         }
    };
});

//判断值的长度是否小于6
CommonDirectives.directive('ltsix', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs,ctrl) {
            if(ctrl){
                var sixValidator = function (value) {
                    var validity = (value.length>20);
                    ctrl.$setValidity("six", !validity);
                    return validity ? undefined : value ;
                };
                ctrl.$parsers.push(twentyValidator);
                ctrl.$formatters.push(twentyValidator);
            }
        }
    };
});

