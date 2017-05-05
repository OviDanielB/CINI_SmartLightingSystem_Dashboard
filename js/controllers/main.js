/**
 * map angular controllers,
 * all of which make AJAX calls
 * to nodeJS server for updated
 * values
 */
angular
.module('app')
.controller('totalLampsCtrl', totalLampsCtrl)
.controller('workingLampsCardCtrl', workingLampsCardCtrl)
.controller('anomalyLampsCardCtrl', anomalyLampsCardCtrl)
.controller('totalStreetsCardCtrl', totalStreetsCardCtrl)
.controller('MinConsumptionCtrl', MinConsumptionCtrl)
.controller('lampListCtrl',lampListCtrl)
    .controller('lampRankingCtrl',lampRankingCtrl)
    .controller('HourConsumptionCtrl', HourConsumptionCtrl)
    .controller('DayConsumptionCtrl', DayConsumptionCtrl)
    .controller('RadarCtrl', RadarCtrl)
    .controller('lampStatCtrl',lampStatCtrl)
    .controller('streetStatCtrl',streetStatCtrl);


/**
 * controls street consumption statistics table
 */
streetStatCtrl.$inject = ['$scope','$http'];
function streetStatCtrl($scope,$http) {

    $http.get('/api/stat/streets').then(function (res) {
       $scope.streets = [];

       var temp = res.data;

       temp.forEach(function (e) {
           $scope.streets.push(e);
       });

       $scope.streets.push({
           name: "Test Street",
           hour: 60,
           day: 70,
           week: 90
       });
    },function (err) {
        console.log(err);
    });
}

/**
 * controls street consumption statistics table
 */
lampStatCtrl.$inject = ['$scope','$http'];
function lampStatCtrl($scope,$http) {

    $http.get('/api/stat/lamps').then(function (res) {
        $scope.lamps = [];
        var temp = res.data; // json body; lamp array

        temp.forEach(function (e) {
            $scope.lamps.push(e);
        });

        $scope.lamps.push({
            id:124,
            address: "Test Street, 69",
            hour: 80,
            day: 90,
            week: 70
        });
    },function (err) {
        console.log(err);
    });
}


/**
 * convert Hex to RGBA
 * @param hex
 * @param opacity
 * @returns {string|*}
 */
function convertHex(hex,opacity){
  hex = hex.replace('#','');
  r = parseInt(hex.substring(0,2), 16);
  g = parseInt(hex.substring(2,4), 16);
  b = parseInt(hex.substring(4,6), 16);

  result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
  return result;
}

/**
 * controls lamps (with relative information
 * like position, anomaly types and lamp model)
 * table
 */
lampListCtrl.$inject = ['$scope','$http'];
function lampListCtrl($scope, $http){

    $scope.lamps = [];

    const testLamp = {
        streetLamp : {
            ID: 52342,
            address: {
                name: "Via Cambridge",
                number: "56"
            },
            lampModel: "LED",
            lightIntensity: "63",
            consumption: "79,25",
            lifetime: {
                date: {
                    day: "5",
                    month: "5",
                    year: "2017"
                }
            }
        },
        anomalies: {
            NOT_RESPONDING: "1"
        }
    };

  $http.get('/api/lamps')
        .then(function(response){

            var temp = response.data;
            $scope.lamps.length = 0; //empty array
            if(temp.length === 0){
                $scope.lamps.push(testLamp);
            }
            temp.forEach(function (ele) {
               $scope.lamps.push(JSON.parse(ele));
               console.log(JSON.parse(ele));
            });

        }, function(error) {
          console.log(error);
        });

}

/**
 * controls card with total lamps count
 */
totalLampsCtrl.$inject = ['$scope','$http'];
function totalLampsCtrl($scope, $http) {

    $scope.total = 1000;
    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    $scope.data = [
        [65, 100, 84, 84, 51, 55, 40]
    ];

    $http.get('/api/totalLamps').then(function (resp) {
        $scope.total = Number(resp.data);
    }, function (error) {
        console.log(error);
    });

$scope.colors = [{
    backgroundColor: brandPrimary,
    borderColor: 'rgba(255,255,255,.55)',
  }];
  $scope.options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, $scope.data[0]) - 5,
          max: Math.max.apply(Math, $scope.data[0]) + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  }
}

/**
 * controls card with working lamps count
 */
workingLampsCardCtrl.$inject = ['$scope','$http'];
function workingLampsCardCtrl($scope, $http) {

  $scope.workingLamps = 1000; // updated from server

  $scope.labels = ['January','February','March','April','May','June','July'];
  $scope.data = [
    [1, 18, 9, 17, 34, 22, 11]
  ];

  $http.get('/api/workingLamps').then(function (response) {
      $scope.workingLamps = Number(response.data);
  },function (error) {
      console.log('Card 2' + error);
  });


  $scope.colors = [{
    backgroundColor: brandSuccess,
    borderColor: 'rgba(255,255,255,.55)',
  }];
  $scope.options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, $scope.data[0]) - 5,
          max: Math.max.apply(Math, $scope.data[0]) + 5
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },

    },
  }
}

/**
 * controls card with anomaly lamps count
 */
anomalyLampsCardCtrl.$inject = ['$scope','$http'];
function anomalyLampsCardCtrl($scope, $http) {

  $scope.anomalyLamps = 1000;

  $scope.labels = ['January','February','March','April','May','June','July'];
  $scope.data = [
    [78, 81, 80, 45, 34, 12, 40]
  ];
  $scope.data4 = [
    [35, 23, 56, 22, 97, 23, 64]
  ];

    $http.get('/api/anomalyLamps').then(function (response) {
        $scope.anomalyLamps = Number(response.data);
    },function (error) {
        console.log('Card 3' + error);
    });


  $scope.colors = [{
    backgroundColor: 'rgba(255,255,255,.2)',
    borderColor: 'rgba(255,255,255,.55)',
  }];
  $scope.options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  }
}

function random(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

/**
 * controls card with total streets count
 */
totalStreetsCardCtrl.$inject = ['$scope','$http'];
function totalStreetsCardCtrl($scope, $http) {

  var elements = 16;
  var labels = [];
  var data = [];

  for (var i = 2000; i <= 2000 + elements; i++) {
    labels.push(i);
    data.push(random(40,100));
  }

  $scope.labels = labels;

  $scope.data = [data];
  $scope.totalStreets = 1000;

    $http.get('/api/totalStreets').then(function (response) {
        $scope.totalStreets = Number(response.data);
    },function (error) {
        console.log('Card 4' + error);
    });


    $scope.colors = [{
    backgroundColor: 'rgba(255,255,255,.3)',
    borderWidth: 0
  }];
  $scope.options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 0.6,
      }],
      yAxes: [{
        display: false
      }]
    },
  }
}

function getSum(total, num) {
    return total + Math.round(num);
}


/**
 * controls chart with global consumption values
 * from the latest hour (last 60 values)
 * also calculates the mean of the latest values
 * (red dashed line)
 */
MinConsumptionCtrl.$inject = ['$scope','$http'];
function MinConsumptionCtrl($scope, $http){


  $scope.series = ['Actual', 'Previous', 'Mean Actual'];
  var max = 250;

  $http.get('/api/globalStatMin').then(function (res) {

      var received = res.data;
      var actualData = received.globalDataMin;
      var meanActual = [];


      var mean = actualData.reduce(getSum,0) / actualData.length;
      for(var i = 0; i < actualData.length; i++){
          meanActual.push(mean);
      }

      max = actualData.max;
      $scope.data = [actualData, [], meanActual];
      $scope.labels = received.globalLabelsMin;

  }, function (error) {
     console.log(error);
  });



  $scope.colors = [{
    backgroundColor: convertHex(brandInfo,10),
    borderColor: brandInfo,
    pointHoverBackgroundColor: '#fff'

  }, {
    backgroundColor: 'transparent',
    borderColor: brandSuccess,
    pointHoverBackgroundColor: '#fff'
  },{
    backgroundColor: 'transparent',
    borderColor: brandDanger,
    pointHoverBackgroundColor: '#fff',
    borderWidth: 1,
    borderDash: [8, 5]
  }];
  $scope.options = {
      responsive: true,
      maintainAspectRatio: false,

      scales: {
          xAxes: [{
              gridLines: {
                  drawOnChartArea: false,
              },
              ticks: {
                  callback: function(value) {
                      return value.charAt(0);
                  }
              }
          }],
          yAxes: [{
              ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 5,
                  stepSize: Math.ceil((max+max/3) / 5),
                  max: max + max /3
              }
          }]
      },
      elements: {
          point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3,
          }
      },
  };
}



/**
 * controls chart with global consumption values
 * from the latest day (last 24 values)
 * also calculates the mean of the latest values
 * (red dashed line)
 */
HourConsumptionCtrl.$inject = ['$scope','$http'];
function HourConsumptionCtrl($scope, $http) {

    $scope.series = ['Actual', 'Normal','Actual Mean'];

    var max = 250;

    $http.get('/api/globalStatHour').then(function (response) {

        var received = response.data;

        var actualData = received.globalDataHour;
        var previousData = [];
        var meanActual = [];

        actualData.forEach(function (ele) {
            previousData.push(ele /3 * 2);
        });


        var mean = actualData.reduce(getSum,0) / actualData.length;
        for(var i = 0; i < actualData.length; i++){
            meanActual.push(mean);
        }

        max = actualData.max;

       $scope.data = [actualData,previousData,meanActual];
       $scope.labels = received.globalLabelsHour;


    }, function (error) {
        console.log(error);
    });

    $scope.options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 100,
                    stepSize: Math.ceil( (max + max/3)  / 5),
                    max: max + max / 3
                }
            }]
        }
    };



    $scope.colors = [{
        backgroundColor: convertHex(brandSuccess,50),
        borderColor: brandWarning,
        pointHoverBackgroundColor: '#fff'
    },{
        backgroundColor: 'transparent',
        borderColor: brandSuccess,
        pointHoverBackgroundColor: '#fff'
    },
        {
            backgroundColor: 'transparent',
            borderColor: brandDanger,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5]
        }];


}

/**
 * controls chart with global consumption values
 * from the latest week (last 7 values)
 * also calculates the mean of the latest values
 * (red dashed line)
 */
DayConsumptionCtrl.$inject = ['$scope','$http'];
function DayConsumptionCtrl($scope, $http) {

    $scope.series = ['Actual', 'Normal','Actual Mean'];


    var max = 250;

    $http.get('/api/globalStatDay').then(function (response) {

        var received = response.data;

        var actualData = received.globalDataDay;
        var previousData = [];
        var meanActual = [];

        actualData.forEach(function (ele) {
            previousData.push(ele / 3 * 2);
        });

        var mean = actualData.reduce(getSum,0) / actualData.length;
        for(var i = 0; i < actualData.length; i++){
            meanActual.push(mean);
        }

        max = actualData.max;

        $scope.data =[actualData,previousData,meanActual] ;
        $scope.labels = received.globalLabelsDay;



    }, function (error) {
        console.log(error);
    });

    $scope.options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 100,
                    stepSize: Math.ceil((max + max/3) / 5),
                    max: max + max/3
                }
            }]
        }
    };


    $scope.colors = [{
        backgroundColor: convertHex(brandWarning,40),
        borderColor: brandDanger,
        pointHoverBackgroundColor: '#fff'
    },
        {
            backgroundColor: 'transparent',
            borderColor: brandPrimary,
            pointHoverBackgroundColor: '#fff'
        },
        {
            backgroundColor: 'transparent',
            borderColor: brandDanger,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5]
        }];
}

/**
 * controls radar chart with information on the number of
 * different anomalies types
 */
RadarCtrl.$inject = ['$scope'];
function RadarCtrl($scope) {
    $scope.labels =['Weather Less', 'Not Responding', 'Damaged Bulb', 'Weather More', 'Light Intensity Less', 'Light Intensity More'];

    $scope.data = [
        [65, 59, 90, 81, 56, 55],
        [28, 48, 40, 19, 96, 100]
    ];

    $scope.colors = [{
        backgroundColor: convertHex(brandInfo,40),
        borderColor: brandDanger,
        pointHoverBackgroundColor: '#fff'
    }];
}


/**
 * controls oldest lamp bulb ranking
 */
lampRankingCtrl.$inject = ['$scope','$http'];
function lampRankingCtrl($scope,$http) {
    var lamps = [{id:13122, address: { name: 'Via Politenico'}},
                 {id:321,address: { name: 'Via Cambridge'}},
                 {id:5432,address: { name: 'Via Politenico'}},
                 {id:432,address: { name: 'Via Cambridge'} }];

    $scope.lamps = [];

    $http.get("/api/ranking").then(function (res) {
      if(res.data.length === 0){
          $scope.lamps = lamps;
          $scope.oldestLampsCount = lamps.length;
      }
      res.data.ranking.forEach(function (ele) {
          $scope.lamps.push(ele);
      });
        $scope.oldestLampsCount = res.data.count;

    },function (err) {
        console.log(err);
    });

}


