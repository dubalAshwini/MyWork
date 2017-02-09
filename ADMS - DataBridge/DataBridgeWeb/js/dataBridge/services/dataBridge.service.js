angular.module('adms_dataBridge.service', [])

    .service('bridgeService', function () {
        var api = {};
        api.getBridge = function (id) {
            return id;
        };
        return api;
    });