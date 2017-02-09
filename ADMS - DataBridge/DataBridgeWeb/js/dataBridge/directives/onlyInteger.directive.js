angular.module('adms_dataBridge.intergerOnly', [])
    .directive('numberOnly', function () {
        console.log("inside directive");
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope) {
                scope.$watch('inputValue', function (newValue, oldValue) {
                    var arr = String(newValue).split("");
                    if (arr.length === 0) return;
                    if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.')) return;
                    if (arr.length === 2 && newValue === '-.') return;
                    if (isNaN(newValue)) {
                        scope.inputValue = oldValue;
                    }
                });
            }
        };
    });
    /*.directive('numberOnly', function () {
        console.log('inside numberOnly');
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elem, attr) {
                elem.on("keyup", function (e) {
                    if (e.keyCode == 69 && e.keyCode == 190) { // if user attempts to enter a hyphen character themselves
                        e.preventDefault();
                        return;
                    }
                });                
            }
        };
    });
*/
    /*
    .directive('onlyInterger', function () {

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    if (inputValue == undefined) return '';
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                    return transformedInput;
                });
            }
        };
    });
    */
