angular.module('adms_dataBridge.metisMenu', [])

    .directive('metis', function ($timeout) {
    return function ($scope, $element, $attrs) {
        //console.log("Inside metisMenu Directive");
        if ($scope.$last == true) {
            $timeout(function () {
                $('#side-menu').metisMenu();
            }, 250)
        }
    };
});