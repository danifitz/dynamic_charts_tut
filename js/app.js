'use strict';

// here we are declaring our Angular module and specifying it's dependencies
angular.module('dynamicCharts', [
    'ngWebsocket',
    'googlechart'
  ])
  .controller('ChartCtrl', function($scope, $websocket) {

    // instance of ngWebsocket, handled by $websocket service
    var ws = $websocket.$new('ws://showcaseapp.mybluemix.net/ws/sensor');

    // callback method that is executed when the websocket opens
    ws.$on('$open', function() {
      console.log('WebSocket open, how easy was that!');
    });

    // callback method that is executed when the websocket receives a message
    ws.$on('$message', function(data) {

      // here we are 'applying' the result of the callback to our $scope
      $scope.$apply(angular.bind(this, function() {
        $scope.pressure[1].v = (data.pressure * 100);
        $scope.flow[1].v = data.flow;
        $scope.vibration[1].v = data.vibration;
        $scope.cpuutil[1].v = data.cpuutil;
      }));
      console.log(data);
    });

    // callback method that is executed when the websocket closes
    ws.$on('$close', function() {
      console.log('websocket closed');
    })

    // our chart object
    $scope.chartObject = {};

    // pressure is one of the columns we are displaying on our chart
    $scope.pressure = [{
      v: "Pressure"
    }, {
      v: 3
    }];

    // flow is one of the columns we are displaying on our chart
    $scope.flow = [{
      v: "Flow"
    }, {
      v: 3
    }];

    // vibration is one of the columns we are displaying on our chart
    $scope.vibration = [{
      v: "PH Level"
    }, {
      v: 3
    }];

    // CPU Util is one of the columns we are displaying on our chart
    $scope.cpuutil = [{
      v: 'CPU utilization'
    }, {
      v: 3
    }];

    // here we define the data being displayed in our chart.
    // we define the columns (cols) and the rows
    // by using data in our scope we can take advantage of
    // Angular's data binding to add the dynamic element
    // to the charts
    $scope.chartObject.data = {
      "cols": [{
        id: "t",
        label: "Amount",
        type: "string"
      }, {
        id: "s",
        label: "Value",
        type: "number"
      }],
      "rows": [{
        c: $scope.pressure
      }, {
        c: $scope.flow
      }, {
        c: $scope.vibration
      }, {
        c: $scope.cpuutil
      }]
    };

    $scope.chartObject.type = 'ColumnChart';
    $scope.chartObject.options = {
      'title': 'Cool, dynamic charts with WebSockets!'
    };

    // we need to close the WebSocket when the controller is destroyed
    // to free up resources etc
    $scope.$on('$destroy', function() {
      ws.$close();
    });
  });
