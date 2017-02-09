/// <reference path="../../vendors/angular.js" />
/*(function (angular) {
    
})(window.angular);*/

'use strict';
var myApp = angular.module('adms_dataBridge.controllers', ['ngRoute', 'ui.bootstrap', 'highcharts-ng', 'ngAnimate', 'ui.mask']);


myApp.config(function ($routeProvider) {
    $routeProvider
    .when('/', {
        controller: '',
        templateUrl: 'templates/blank.html',

    })
    .when('/dashboard', {
        controller: 'DashboardController',
        templateUrl: 'templates/dashboard.html',

    })
    .when('/inPlugin/:inPluginId', {
        controller: 'InPluginController',
        templateUrl: 'templates/plugin.html',

    })
    .when('/outPlugin/:outPluginId', {
        controller: 'OutPluginController',
        templateUrl: 'templates/plugin.html',

    })
    .when('/bridge/:id', {
        controller: 'BridgeController',
        templateUrl: 'templates/bridge.html',

    })
	.when('/realTime', {
	    controller: 'RealTimeModellingController',
	    templateUrl: 'templates/realTime.html',

	})
	.when('/scenario/:scenarioID', {
	    controller: 'ScenarioModellingController',
	    templateUrl: 'templates/scenario.html',

	})
    .when('/scenario/:scenarioID/scenarioDetails', {
        controller: 'ScenarioModellingController',
        templateUrl: 'templates/scenarioDetails.html',

    })
});

/*Controllers*/
myApp.controller('DashboardController', ['$scope', function ($scope) {
    $scope.dashboard = {};
    $scope.plugins = {};
    adms.databridge.getPlugins(function (plugins) {
        console.log("Getting plugins here......");
        console.log(plugins);
        $scope.plugins = plugins;
        $scope.$apply();
    });
}]);

myApp.controller('HomeController', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.config = {};
    $scope.isSecenarioSubmitted = false;
    $scope.breadcrumbs = "templates/breadcrumb.html"; // Variable defined for breadcrumbs   


    $scope.trimUri = function (uri) {
        var sub = uri.substring(uri.indexOf('/', 7));
        return sub.substring(sub.indexOf('/') + 1);
    };
    $scope.encodeUri = function (uri) {
        //return "'" + encodeURIComponent(uri) + "'";
        //return 'bob';
        return uri;
    };
    $scope.splitCommands = function (commands) {
        return commands.split(';');
    };
    $scope.splitCommand = function (command) {
        var items = command.split('=');
        // if the command doesn't contain a space in the name
        if (items[0].indexOf(' ') >= 0) {
            console.log('space found in' + items[0]);
            return { key: 'Command', value: command };
        }
        if (items.length == 1) {
            return { key: 'Command', value: items[0] };
        }
        return { key: items[0], value: items[1] };
    };
    $scope.getMode = function (id) {
        return id == 1 ? "Schedule" : "Subscription";
    }
    adms.databridge.getConfig(function (config) {
        $scope.config = config;
        console.log("Config Data:");
        console.log(config);

        for (var i = 0; i < $scope.config.dataBridge.Bridgees.length; i++) {
            var bridge = $scope.config.dataBridge.Bridgees[i];
            bridge.index = i;
        }

        $scope.$apply();
    });

}]);

myApp.controller('InPluginController', ['$routeParams', '$scope', function ($routeParams, $scope) {
    $scope.inPluginId = $routeParams.inPluginId;
    console.log("$routeParams.inPluginId: " + $routeParams.inPluginId);
    $scope.plugin = $scope.config.dataBridge.InPlugins[$scope.inPluginId];
    $scope.uri = $scope.plugin.Uri;
    console.log($scope.plugin);

}]);

myApp.controller('OutPluginController', ['$routeParams', '$scope', function ($routeParams, $scope) {
    $scope.outPluginId = $routeParams.outPluginId;
    console.log("OutPluginController " + $scope.outPluginId);
    $scope.plugin = $scope.config.dataBridge.OutPlugins[$scope.outPluginId];
    console.log($scope.plugin);

}]);

myApp.controller('BridgeController', ['$routeParams', '$scope', 'highchartsNG', function ($routeParams, $scope, highchartsNG) {
    $scope.id = $routeParams.id;
    console.log("BridgeController " + $scope.id);
    $scope.bridge = $scope.config.dataBridge.Bridgees[$scope.id] // find by URI 

    var fetchData = function () {
        adms.databridge.getData($scope.bridge.Uri, function (data) {
            console.log(data);
            if (data.result) {
                $scope.data = data;
                $scope.loadData();
                $scope.$apply();
            }
        });
    }
    $scope.highchartsNG = {
        options: {
            chart: {
                backgroundColor: 'transparent',
                height: 300
            },
            title: {
                text: ''
            }
        }
    };
    $scope.loadData = function () {
        //console.log('load data');
        $.extend($scope.highchartsNG, widgets.bridgees.lineWidget($scope.data));
    };
    // if the Uri is changed, then we need to reload the bridge data
    $scope.$watch("$scope.bridge.Uri", function () {
        //console.log('Reloading bridgees data: ' + $scope.bridge.Uri);
        if ($scope.bridge.Uri) { fetchData(); }
    });

}]);
myApp.controller('RealTimeModellingController', ['$routeParams', '$scope', function ($routeParams, $scope) {
    //console.log("Inside RealTimeModelling Controller");
}]);
myApp.controller('ScenarioModellingController', ['$routeParams', '$scope', '$location', 'highchartsNG', '$timeout', function ($routeParams, $scope, $location, highchartsNG, $timeout) {
    $scope.newScenarioArray = {
        parameters: [],
    };
    $scope.scenarioID = $routeParams.scenarioID;
    console.log("scenarioID: " + $scope.scenarioID);
    $scope.scenario = $scope.config.scenarios[$scope.scenarioID];
    console.log("--------------Current Scenario--------------");
    console.log($scope.scenario);

    $scope.fetchScenarioRuns = function () {
        adms.databridge.getScenarioRuns($scope.scenarioID, function (data) {
            console.log("-------------- Data for already running Scenario --------------");
            console.log(data);
            if (data.result) {
                $scope.scenarioRunsData = data;
                $scope.$apply();
            }
        });
    }

    adms.databridge.getScenarioRun($scope.scenarioID, function (data) {
        //console.log("--------------Data for Scenario Detail Page--------------");
        //console.log(data);
        if (data.result) {
            $scope.scenarioDetails = data;
            $scope.$apply();

        }
    });

    $scope.fetchScenarioHighchart = function () {
        adms.databridge.getScenarioRunResults($scope.scenarioID, function (data) {
            console.log("--------------Scenario Run Results for Line Chart--------------");
            console.log(data);
            if (data.result) {
                $scope.scenarioHighchartData = data;
                $scope.loadData();
                $scope.$apply();
            }
        });
    }
    $scope.scenarioHighchart = {
        options: {
            chart: {
                backgroundColor: 'transparent',
                height: 300
            },
            title: {
                text: ''
            }
        }
    };
    $scope.loadData = function () {
        $scope.arr = $scope.getIndicesOfDuplicateGroupType();
        console.log("***********************");
        console.log($scope.test);
        console.log("Load Data function");
        $.extend($scope.scenarioHighchart, widgets.scenarios.lineWidget($scope.scenarioHighchartData, $scope.arr[1]));
    };
    /* Function to get indices of duplicate scenario group types */
    $scope.getIndicesOfDuplicateGroupType = function () {
        var storageArr = [];
        var turbineArr = [];
        for (i = 0; i < $scope.scenarioHighchartData.results.length; i++) {
            if ($scope.scenarioHighchartData.results[i].group == 'Storage') {
                storageArr.push(i);
            }
            if ($scope.scenarioHighchartData.results[i].group == 'Turbine') {
                turbineArr.push(i);
            }
        }
        return [storageArr, turbineArr]
    }
    /* Function to create array of scenario group types except duplicate group name entries */
    $scope.findScenarioGroupTypes = function (obj) {
        $scope.groupTypeArr = [];
        $scope.arr = {};
        var i;
        for (i = 0; i < obj.results.length; i++) {            
            $scope.arr[obj.results[i].group] = 0;
        }
        for (i in $scope.arr) {
            $scope.groupTypeCount.push(i);
        }       
        return $scope.groupTypeArr;
    }
    /*   
    $scope.checkScenarioType = function (type) {        
        switch (type) {
            case 'int':                
                $scope.inputPattern = '/^\d+$/'; // Number
                break;
            case 'float':
                $scope.inputPattern = '/^\d*\.?\d*$/'; // Decimal with optional '.'
                break;
            case 'string':
                $scope.inputPattern = '[A-Za-z]'; // uppercase or lowercase charaters
                break;            
            case 'csv':
                $scope.inputPattern = '/^[ A-Za-z0-9_@./#&+-]*$/'; // Alpha numeric values including special characters
                break;
        }               
    };
   
    */

    /* Function called when user submit their New Scenario */
    $scope.submitScenarioData = function (newScenario) {

        console.log("New scenario input data");
        //Added new scenario data into 'newScenarioArray' here        
        $scope.newScenarioArray.scenarioRunId = $scope.scenarioRunsData.runs.length;

        for (var i = 0; i < $scope.scenario.config.parameters.length; i++) {
            $scope.newScenarioArray.parameters[i].name = $scope.scenario.config.parameters[i].name;
            $scope.newScenarioArray.parameters[i].type = $scope.scenario.config.parameters[i].type;
        }
        console.log($scope.newScenarioArray);

        // Pushed newly added scenario into already running scenario grid panel         
        var localScenario = angular.copy($scope.newScenarioArray);
        $scope.scenarioRunsData.runs.push(localScenario);
        console.log("Check for pushed new scenario data");
        console.log($scope.scenarioRunsData);
        $scope.runNewScenario($scope.newScenarioArray);
        $scope.resetNewScenarioInputs();

    }

    /* Function to reset all the input values of New Scenario Panel */
    $scope.resetNewScenarioInputs = function () {
        console.log("Reset Scenario Inputs");
        $scope.newScenarioArray.scenarioRunId = '';
        $scope.newScenarioArray.description = '';
        $scope.newScenarioArray.timeStamp = '';
        for (var i = 0; i < $scope.newScenarioArray.parameters.length; i++) {
            $scope.newScenarioArray.parameters[i].value = '';
        }
        console.log($scope.newScenarioArray);
    }

    $scope.formatDate = function (dateInput) {
        var newDate = dateInput.substring((dateInput.indexOf('(') + 1), dateInput.indexOf(')'));
        return newDate;
    }

    /* Function to edit parameters of already running scenario after hiting 'Param' button in Scenario Runs Panel*/
    $scope.editScenario = function (index, newScenarioArray) {

        $scope.newScenarioArray = {
            scenarioRunId: '',
            description: '',
            parameters: [],
            timeStamp: '',
            runTime: ''
        };
        console.log(newScenarioArray)
        $scope.newScenarioArray = newScenarioArray;

        $scope.index = index;
        var scenarioValLength = $scope.scenarioRunsData.runs[$scope.index].parameters.length;

        console.log("Assigning alreday running scenario to new Scenario panel inputs for edit");
        //$scope.newScenarioArray.scenarioRunId = $scope.index;
        console.log(typeof $scope.newScenarioArray);
        $scope.newScenarioArray.description = $scope.scenarioRunsData.runs[$scope.index].description;
        if ($scope.newScenarioArray.parameters.length == 0) {
            for (i = 0; i < scenarioValLength; i++) {
                $scope.newScenarioArray.parameters[i] = {};
                $scope.newScenarioArray.parameters[i].value = $scope.scenarioRunsData.runs[$scope.index].parameters[i].value;
            }
        }
        else {
            for (i = 0; i < scenarioValLength; i++) {
                $scope.newScenarioArray.parameters[i].value = $scope.scenarioRunsData.runs[$scope.index].parameters[i].value;
            }
        }
        console.log($scope.newScenarioArray);
    }

    /* Function to send newly added scenario to server */
    $scope.runNewScenario = function (runNewScenario) {
        console.log("Sending new scenario to Server");
        $scope.newScenario = runNewScenario;
        adms.databridge.startNewScenarioRun($scope.newScenario.scenarioRunId, $scope.newScenario.description, $scope.newScenario.parameters, function (result) {
            // do what you need to do on complete

        });
    }

    // If the location is changed, then we need to reload the scenario data
    $scope.$watch("location", function () {
        if ($location) {
            $scope.fetchScenarioRuns();
            $scope.fetchScenarioHighchart();
        }
    });


}]);


