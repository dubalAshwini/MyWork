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