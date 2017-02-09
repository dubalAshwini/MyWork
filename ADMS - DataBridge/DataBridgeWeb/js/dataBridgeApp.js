var adms = {
    databridge: {
        getConfig: function(oncomplete) {
            $.ajax({
                dataType: 'json',
                url: '/Home/GetConfig',
                success: function(result) {
                    oncomplete(result);
                },
                error: function(a, b, c) {
                    console.log(b);
                }
            });
        },
        getPlugins: function (oncomplete) {
            $.ajax({
                dataType: 'json',
                url: '/Home/GetPlugins',
                success: function (result) {
                    oncomplete(result);
                },
                error: function (a, b, c) {
                    console.log(b);
                }
            });
        },
        getData: function (uri, oncomplete) {
            $.ajax({
                dataType: 'json',
                data: { 
                    uri: uri
                },
                url: '/Home/GetData',
                success: function (result) {
                    oncomplete(result);
                },
                error: function (a, b, c) {
                    console.log(b);
                }
            });
        },
        getScenarioRun: function (id, oncomplete) {
            $.ajax({
                dataType: 'json',
                data: {
                    id: id
                },
                url: '/Home/GetScenarioRun',
                success: function (result) {
                    oncomplete(result);
                },
                error: function (a, b, c) {
                    console.log(b);
                }
            });
        },
        getScenarioRuns: function (id, oncomplete) {
            $.ajax({
                dataType: 'json',                
                data: {
                    id: id
                },
                url: '/Home/GetScenarioRuns',
                success: function (result) {
                    oncomplete(result);
                },
                error: function (a, b, c) {
                    console.log(b);
                }
            });
        },
        getScenarioRunResults: function (id, oncomplete) {
            $.ajax({
                dataType: 'json',
                data: {
                    id: id
                },
                url: '/Home/GetScenarioRunResults',
                success: function (result) {
                    oncomplete(result);
                },
                error: function (a, b, c) {
                    console.log(b);
                }
            });
        },
        startNewScenarioRun: function (id, description, parameters, oncomplete) {
            $.ajax({               
                dataType: 'json',               
                type: 'POST',
                data: {
                    id: id,
                    description: description,
                    parameters: parameters,
                },
                url: '/Home/StartScenarioRun',
                success: function (result) {
                    oncomplete(result);
                },
                error: function (a, b, c) {                    
                    console.log(b);
                }
            });
        }
    }
};

var getTime = function (str) {
    var int = parseInt(str.split('(')[1].split(')')[0]);
    return int;
    //return new Date(int);
};


(function () {
    'use strict';

    angular.module('adms_dataBridge', [
        'highcharts-ng', // Angular wrapper for jQuery Highcharts plugin

        /* Controllers */
        'adms_dataBridge.controllers',

        /* Directives */
        'adms_dataBridge.metisMenu',
        //'adms_dataBridge.intergerOnly',

        //'highcharts-ng', // Angular wrapper for jQuery Highcharts plugin

        /* Services */
        'adms_dataBridge.service',


    ])
})();



$(function () {
    $('#side-menu').metisMenu();
    
    $('#startDatePicker').datepicker({
        autoclose: true,    // It is false, by default
    });
    $('#endDatePicker').datepicker({
        autoclose: true,    // It is false, by default
    });
});



//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function () {
    $(window).bind("load resize", function () {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function () {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});

var widgets = {
    colours: ['#AA4643', '#4572A7', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
    drawTimeRegions: function (chart, type) {
        var min = chart.xAxis[0].min;
        var max = chart.xAxis[0].max;
        var change = max - min;
        if (change >= 2592000000) {
            type = 1;
        } else if (change < 2592000000) {
            type = 0;
        }
        var colour = 'rgba(220,200,180,0.1)';

        // clear all plot bands
        if (chart.xAxis[0].plotLinesAndBands != null) {
            for (var p in chart.xAxis[0].plotLinesAndBands) {
                var band = chart.xAxis[0].plotLinesAndBands[p];
                if (band.id != null && band.id.indexOf("we") == 0) {
                    chart.xAxis[0].removePlotBand(band.id);
                }
            }
        }

        // to start with, lets do just weekends
        var d = new Date(min);
        if (type == 2) {
            // show months
            var from = new Date(d.getFullYear(), d.getMonth(), 1);
            var to = new Date(d.getFullYear(), d.getMonth() + 1, 1);
            do {
                chart.xAxis[0].addPlotBand({
                    from: from.getTime(),
                    to: to.getTime(),
                    color: colour,
                    id: 'we',
                    zIndex: -2
                });
                from.setMonth(from.getMonth() + 2);
                to.setMonth(to.getMonth() + 2);
            } while (to.getTime() < max);
        }
        if (type == 1) {
            // show weekends
            d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
            d.setUTCSeconds(0);
            d.setUTCMinutes(0);
            d.setUTCHours(0);
            var i = d.getTime();
            do {
                chart.xAxis[0].addPlotBand({
                    from: i,
                    to: i + 2 * 24 * 60 * 60 * 1000,
                    color: colour,
                    id: 'we',
                    zIndex: -2
                });
                i += 7 * 24 * 60 * 60 * 1000;
            } while (i < max);
        }
        if (type == 0) {
            // show night
            // from 6PM to 6AM
            //d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
            d.setUTCSeconds(0);
            d.setUTCMinutes(0);
            d.setUTCHours(0);
            var i = d.getTime();
            do {
                //console.log(new Date(i));
                //console.log(new Date(i + (6 * 60 * 60 * 1000)));
                chart.xAxis[0].addPlotBand({
                    from: i,
                    to: i + (6 * 60 * 60 * 1000),
                    color: colour,
                    id: 'we',
                    zIndex: -2
                });
                chart.xAxis[0].addPlotBand({
                    from: i + (18 * 60 * 60 * 1000),
                    to: i + (24 * 60 * 60 * 1000),
                    color: colour,
                    id: 'we',
                    zIndex: -2
                });
                i += 24 * 60 * 60 * 1000;
            } while (i < max);
        }
    },    
    generateData: function(input){
        var series = [];
        var data = [];           
        
        
        for (var i = 0; i < input.values.length; i++) {
            value = input.values[i];            
            data.push([
                    getTime(value.timeStamp),
                    value.value
            ]);
        }
    
        series.push({
            name: "Data",
            color: widgets.colours[0],
            data: data
        });
         
        return { series: series };
    },
    generateScenarioData: function (input) {        
        var series = [];       
        
        for (var i = 0; i < input.results.length; i++) {
            var data = [];
            for (var j = 0; j < input.results[i].values.length; j++) {
                value = input.results[i].values[j];
                data.push([
                        getTime(value.time),
                        value.value
                ]);
            }
            series.push({
                name: input.results[i].name,
                color: widgets.colours[i],
                data: data
            });
        } 
        return { series: series };
    },
    bridgees: {
        lineWidget: function (data) {
            var result = widgets.generateData(data);
            var series = result.series;            
            var labelType = '{value: %H:%M}';            
            var type = 'line';
            
            var config = {
                options: {
                    colors: widgets.colours,
                    chart: {
                        backgroundColor: 'transparent',
                        type: type,
                        marginTop: 34,
                        marginLeft: 40,
                        height: 300,                        
                        events: {
                            load: function (event) {
                                //widgets.drawTimeRegions(event.target, 0);
                                //widgets.updatePie(event.target);
                            },
                            redraw: function (event) {
                                widgets.drawTimeRegions(event.target, 0);
                                //widgets.updatePie(event.target);
                            }
                        }
                    },
                    plotOptions: {
                       line: {
                            lineWidth: 2,
                            marker: {
                                enabled: false
                            },
                            opacity:1
                        },                        
                        series:{
                            dataLabels: {
                                formatter: function () {
                                    return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(2) + ' %';
                                }
                            }
                        }
                    },
                    legend: {
                        enabled: true,
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150,
                    labels: {
                        format: labelType
                    }
                },
                yAxis: {
                    title: {
                        text: 'W h',
                        textAlign: 'right',
                        rotation: 0,
                        x: 30,
                        y: -165
                    }
                },
                tooltip: {
                    enabled: true
                },
                credits: {
                    enabled: false
                },
                series: series
            }
            
            return config;
        },
    },
    scenarios: {
        lineWidget: function (data) {
            var result = widgets.generateScenarioData(data);
            var series = result.series;            
            var labelType = '{value: %H:%M}';
            var type = 'line';

            var config = {
                options: {
                    colors: widgets.colours,
                    chart: {
                        backgroundColor: 'transparent',
                        type: type,
                        marginTop: 34,
                        marginLeft: 40,
                        height: 300,
                        events: {
                            load: function (event) {
                                //widgets.drawTimeRegions(event.target, 0);
                                //widgets.updatePie(event.target);
                            },
                            redraw: function (event) {
                                widgets.drawTimeRegions(event.target, 0);
                                //widgets.updatePie(event.target);
                            }
                        }
                    },
                    plotOptions: {
                        line: {
                            lineWidth: 2,
                            marker: {
                                enabled: false
                            },
                            opacity: 1
                        },
                        series: {
                            dataLabels: {
                                formatter: function () {
                                    return '<b>' + this.point.name + '</b>: ' + this.percentage.toFixed(2) + ' %';
                                }
                            }
                        }
                    },
                    legend: {
                        enabled: true,
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150,
                    /*labels: {
                        format: labelType
                    }*/
                },
                yAxis: {
                    title: {
                        text: 'W h',
                        textAlign: 'right',
                        rotation: 0,
                        x: 30,
                        y: -165
                    }
                },
                tooltip: {
                    enabled: true
                },
                credits: {
                    enabled: false
                },
                series: series
            }

            return config;
        },

    }

};
angular.module('adms_dataBridge.service', [])

    .service('bridgeService', function () {
        var api = {};
        api.getBridge = function (id) {
            return id;
        };
        return api;
    });
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
        $scope.test = $scope.getIndicesOfDuplicateGroupType();
        console.log("***********************");
        console.log($scope.test);
        console.log("Load Data function");        
        $.extend($scope.scenarioHighchart, widgets.scenarios.lineWidget($scope.scenarioHighchartData));
    };

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
    $scope.findScenarioGroupTypes = function (obj) {
        $scope.groupTypeCount = [];
        $scope.arr = {};
        var i;
        for (i = 0; i < obj.results.length; i++) {            
            $scope.arr[obj.results[i].group] = 0;
        }
        for (i in $scope.arr) {
            $scope.groupTypeCount.push(i);
        }
        console.log($scope.groupTypeCount);
        return $scope.groupTypeCount;
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


