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