//main.js
angular
.module('app')
.controller('cardChartCtrl1', cardChartCtrl1)
.controller('cardChartCtrl2', cardChartCtrl2)
.controller('cardChartCtrl3', cardChartCtrl3)
.controller('cardChartCtrl4', cardChartCtrl4)
.controller('MinConsumptionCtrl', MinConsumptionCtrl)
.controller('socialBoxCtrl', socialBoxCtrl)
.controller('sparklineChartCtrl', sparklineChartCtrl)
.controller('barChartCtrl', barChartCtrl)
.controller('horizontalBarsCtrl', horizontalBarsCtrl)
.controller('horizontalBarsType2Ctrl', horizontalBarsType2Ctrl)
.controller('usersTableCtrl', usersTableCtrl)
.controller('lampListCtrl',lampListCtrl)
    .controller('lampRankingCtrl',lampRankingCtrl)
    .controller('HourConsumptionCtrl', HourConsumptionCtrl)
    .controller('DayConsumptionCtrl', DayConsumptionCtrl)
    .controller('RadarCtrl', RadarCtrl)
    .controller('logoBubbleCtrl',logoBubbleCtrl)
    .controller('lampStatCtrl',lampStatCtrl)
    .controller('streetStatCtrl',streetStatCtrl);


streetStatCtrl.$inject = ['$scope','$http'];
function streetStatCtrl($scope,$http) {

    $http.get('/api/stat/streets').then(function (res) {
       $scope.streets = [];

       var temp = res.data;

       temp.forEach(function (e) {
           $scope.streets.push(e);
       });

       $scope.streets.push({
           name: "Via cazzo",
           hour: 60,
           day: 70,
           week: 90
       });
    },function (err) {
        console.log(err);
    });
}


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
            address: "Via cazzo 69",
            hour: 80,
            day: 90,
            week: 70
        });
    },function (err) {
        console.log(err);
    });
}



logoBubbleCtrl.$inject = ['$scope','$http','$interval'];
function logoBubbleCtrl($scope,$http,$interval) {

    $scope.options = {
        scales: {
            xAxes: [{
                display: false,
                ticks: {
                    max: 125,
                    min: -125,
                    stepSize: 10
                }
            }],
            yAxes: [{
                display: false,
                ticks: {
                    max: 125,
                    min: -125,
                    stepSize: 10
                }
            }]
        }
    };

    createChart();
    $interval(createChart, 2000);

    function createChart () {
        $scope.series = [];
        $scope.data = [];
        for (var i = 0; i < 50; i++) {
            $scope.data.push([{
                x: randomScalingFactor(),
                y: randomScalingFactor(),
                r: randomRadius()
            }]);
        }
    }

    function randomScalingFactor () {
        return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
    }

    function randomRadius () {
        return Math.abs(randomScalingFactor()) / 4;
    }
}

//convert Hex to RGBA
function convertHex(hex,opacity){
  hex = hex.replace('#','');
  r = parseInt(hex.substring(0,2), 16);
  g = parseInt(hex.substring(2,4), 16);
  b = parseInt(hex.substring(4,6), 16);

  result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
  return result;
}

lampListCtrl.$inject = ['$scope','$http'];
function lampListCtrl($scope, $http){

  const l1 = {"anomalies":{"DAMAGED_BULB":1.0,"NOT_RESPONDING":0.0},"noResponseCount":0,"streetLamp":{"ID":78569,"on":false,"lampModel":"LED","address":{"name":"POLITECNICO","number":26828,"numberType":"CIVIC"},
  "lightIntensity":58.848267,"consumption":58.94588,
  "lifetime":{"date":{"year":2017,"month":1,"day":19},
  "time":{"hour":15,"minute":33,"second":13,"nano":598000000}}},
  "timestamp":1491917600000,"naturalLightLevel":76.880745};

  const l2 = {"anomalies":{"DAMAGED_BULB":1.0,"NOT_RESPONDING":0.0},"noResponseCount":0,
  "streetLamp":{"ID":2569,"on":false,"lampModel":"LED","address":{"name":"POLITECNICO","number":26828,"numberType":"CIVIC"},
  "lightIntensity":58.848267,"consumption":58.94588,
  "lifetime":{"date":{"year":2017,"month":1,"day":19},
  "time":{"hour":15,"minute":33,"second":13,"nano":598000000}}},
  "timestamp":1491917600000,"naturalLightLevel":76.880745};
  //$scope.lamps = [l1, l2];

    $scope.lamps = [];

  $http.get('/api/lamps')
        .then(function(response){
          //$scope.lamps = JSON.parse(response.data);
            var temp = response.data;
            $scope.lamps.length = 0; //empty array
            temp.forEach(function (ele) {
               $scope.lamps.push(JSON.parse(ele));
               console.log(JSON.parse(ele));
            });
          console.log(response.data);

        }, function(error) {
          console.log(error);
        });

}

cardChartCtrl1.$inject = ['$scope','$http'];
function cardChartCtrl1($scope,$http) {

    $scope.total = 1000;
    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    $scope.data = [
        [65, 100, 84, 84, 51, 55, 40]
    ];

    $http.get('/api/totalLamps').then(function (resp) {
        //success
        $scope.total = Number(resp.data);
        console.log("TOTAL : " + resp.data);
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

cardChartCtrl2.$inject = ['$scope','$http'];
function cardChartCtrl2($scope,$http) {

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

cardChartCtrl3.$inject = ['$scope','$http'];
function cardChartCtrl3($scope,$http) {

  $scope.anomalyLamps = 1000; // updated from server

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

cardChartCtrl4.$inject = ['$scope','$http'];
function cardChartCtrl4($scope,$http) {

  var elements = 16;
  var labels = [];
  var data = [];
  //
  for (var i = 2000; i <= 2000 + elements; i++) {
    labels.push(i);
    data.push(random(40,100));
  }

  $scope.labels = labels;

  $scope.data = [data];
  $scope.totalStreets = 1000; //updated from server

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

MinConsumptionCtrl.$inject = ['$scope','$http'];
function MinConsumptionCtrl($scope, $http){

  function random(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  $scope.series = ['Actual', 'Previous', 'Mean Actual'];
  var max = 250;

  $http.get('/api/globalStatMin').then(function (res) {
      var received = res.data;

      var actualData = received.globalDataMin;
      //var previousConsumption = [];
      var meanActual = [];


      /*
      actualData.forEach(function (ele) {
         previousConsumption.push(ele / 3 * 2);
      }); */

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



HourConsumptionCtrl.$inject = ['$scope','$http'];
function HourConsumptionCtrl($scope, $http) {

    $scope.series = ['Actual', 'Normal','Actual Mean'];

    var max = 250;

    $http.get('/api/globalStatHour').then(function (response) {

        var received = response.data;

        var actualData = received.globalDataHour;
        console.log("HOUR : " + actualData);
        var previousData = [];
        var meanActual = [];

        actualData.forEach(function (ele) {
            previousData.push(ele /3 * 2);
        });


        var mean = actualData.reduce(getSum,0) / actualData.length;
        console.log("HOUR MEAN " + mean);
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

DayConsumptionCtrl.$inject = ['$scope','$http'];
function DayConsumptionCtrl($scope, $http) {

    $scope.series = ['Actual', 'Normal','Actual Mean'];


    var max = 250;

    $http.get('/api/globalStatDay').then(function (response) {

        var received = response.data;

        var actualData = received.globalDataDay;
        console.log("DAY : " + actualData);
        var previousData = [];
        var meanActual = [];

        actualData.forEach(function (ele) {
            previousData.push(ele / 3 * 2);
        });

        var mean = actualData.reduce(getSum,0) / actualData.length;
        console.log("HOUR MEAN " + mean);
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


lampRankingCtrl.$inject = ['$scope','$http'];
function lampRankingCtrl($scope,$http) {
    var lamps = [{ID:13122, Street: 'Via Politenico',Perc: 30},
        {ID:321,Street: 'Via Cambridge',Perc : 80},
        {ID:5432,Street: 'Via Cambridge',Perc : 60},
        {ID:432,Street: 'Via Cambridge',Perc : 20}];

    var oldestLampsCount;

    $scope.lamps = lamps;
    $scope.oldestLampsCount = oldestLampsCount;

    $http.get("/api/ranking").then(function (res) {
      $scope.lamps.length = 0;
      res.data.ranking.forEach(function (ele) {
          $scope.lamps.push(ele);
      });
        $scope.oldestLampsCount = res.data.count;

    },function (err) {
        console.log(err);
    });

}

dateRangeCtrl.$inject = ['$scope'];
function dateRangeCtrl($scope) {
  $scope.date = {
    startDate: moment().subtract(5, 'days'),
    endDate: moment()
  };
  $scope.opts = {
    drops: 'down',
    opens: 'left',
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 days': [moment().subtract(7, 'days'), moment()],
      'Last 30 days': [moment().subtract(30, 'days'), moment()],
      'This month': [moment().startOf('month'), moment().endOf('month')]
    }
  };

  //Watch for date changes
  $scope.$watch('date', function(newDate) {
    //console.log('New date set: ', newDate);
  }, false);

  function gd(year, month, day) {
    return new Date(year, month - 1, day).getTime();
  }
}

socialBoxCtrl.$inject = ['$scope'];
function socialBoxCtrl($scope) {

  $scope.labels = ['January','February','March','April','May','June','July'];
  $scope.data1 = [
    [65, 59, 84, 84, 51, 55, 40]
  ];
  $scope.data2 = [
    [1, 13, 9, 17, 34, 41, 38]
  ];
  $scope.data3 = [
    [78, 81, 80, 45, 34, 12, 40]
  ];
  $scope.data4 = [
    [35, 23, 56, 22, 97, 23, 64]
  ];
  $scope.colors = [{
    backgroundColor: 'rgba(255,255,255,.1)',
    borderColor: 'rgba(255,255,255,.55)',
    pointHoverBackgroundColor: '#fff'
  }];
  $scope.options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display:false,
      }],
      yAxes: [{
        display:false,
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
  }
}

sparklineChartCtrl.$inject = ['$scope'];
function sparklineChartCtrl($scope) {
  $scope.labels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  $scope.data1 = [
    [65, 59, 84, 84, 51, 55, 40]
  ];
  $scope.data2 = [
    [1, 13, 9, 17, 34, 41, 38]
  ];
  $scope.data3 = [
    [78, 81, 80, 45, 34, 12, 40]
  ];
  $scope.data4 = [
    [35, 23, 56, 22, 97, 23, 64]
  ];
  $scope.default = [{
    backgroundColor: 'transparent',
    borderColor: '#d1d4d7',
  }];
  $scope.primary = [{
    backgroundColor: 'transparent',
    borderColor: brandPrimary,
  }];
  $scope.info = [{
    backgroundColor: 'transparent',
    borderColor: brandInfo,
  }];
  $scope.danger = [{
    backgroundColor: 'transparent',
    borderColor: brandDanger,
  }];
  $scope.warning = [{
    backgroundColor: 'transparent',
    borderColor: brandWarning,
  }];
  $scope.success = [{
    backgroundColor: 'transparent',
    borderColor: brandSuccess,
  }];
  $scope.options = {
    scales: {
      xAxes: [{
        display:false,
      }],
      yAxes: [{
        display:false,
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
  }
}

horizontalBarsCtrl.$inject = ['$scope'];
function horizontalBarsCtrl($scope) {

  $scope.data = [
    {
      day: 'Monday',    new: 34, recurring: 78
    },
    {
      day: 'Tuesday',   new: 56, recurring: 94
    },
    {
      day: 'Wednesday', new: 12, recurring: 67
    },
    {
      day: 'Thursday',  new: 43, recurring: 91
    },
    {
      day: 'Friday',    new: 22, recurring: 73
    },
    {
      day: 'Saturday',  new: 53, recurring: 82
    },
    {
      day: 'Sunday',    new: 9,  recurring: 69
    }
  ];
}

horizontalBarsType2Ctrl.$inject = ['$scope'];
function horizontalBarsType2Ctrl($scope) {

  $scope.gender = [
    {
      title: 'Male',
      icon: 'icon-user',
      value: 43
    },
    {
      title: 'Female',
      icon: 'icon-user-female',
      value: 37
    },
  ];

  $scope.source = [
    {
      title: 'Organic Search',
      icon: 'icon-globe',
      value: 191235,
      percent: 56
    },
    {
      title: 'Facebook',
      icon: 'icon-social-facebook',
      value: 51223,
      percent: 15
    },
    {
      title: 'Twitter',
      icon: 'icon-social-twitter',
      value: 37564,
      percent: 11
    },
    {
      title: 'LinkedIn',
      icon: 'icon-social-linkedin',
      value: 27319,
      percent: 8
    }
  ];
}

usersTableCtrl.$inject = ['$scope', '$timeout'];
function usersTableCtrl($scope, $timeout) {

  $scope.users = [
    {
      avatar: '1.jpg',
      status: 'active',
      name: 'Yiorgos Avraamu',
      new: true,
      registered: 'Jan 1, 2015',
      country: 'USA',
      flag: 'USA.png',
      usage: '50',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'mastercard',
      activity: '10 sec ago',
      satisfaction: '48'
    },
    {
      avatar: '2.jpg',
      status: 'busy',
      name: 'Avram Tarasios',
      new: false,
      registered: 'Jan 1, 2015',
      country: 'Brazil',
      flag: 'Brazil.png',
      usage: '10',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'visa',
      activity: '5 minutes ago',
      satisfaction: '61'
    },
    {
      avatar: '3.jpg',
      status: 'away',
      name: 'Quintin Ed',
      new: true,
      registered: 'Jan 1, 2015',
      country: 'India',
      flag: 'India.png',
      usage: '74',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'stripe',
      activity: '1 hour ago',
      satisfaction: '33'
    },
    {
      avatar: '4.jpg',
      status: 'offline',
      name: 'Enéas Kwadwo',
      new: true,
      registered: 'Jan 1, 2015',
      country: 'France',
      flag: 'France.png',
      usage: '98',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'paypal',
      activity: 'Last month',
      satisfaction: '23'
    },
    {
      avatar: '5.jpg',
      status: 'active',
      name: 'Agapetus Tadeáš',
      new: true,
      registered: 'Jan 1, 2015',
      country: 'Spain',
      flag: 'Spain.png',
      usage: '22',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'google',
      activity: 'Last week',
      satisfaction: '78'
    },
    {
      avatar: '6.jpg',
      status: 'busy',
      name: 'Friderik Dávid',
      new: true,
      registered: 'Jan 1, 2015',
      country: 'Poland',
      flag: 'Poland.png',
      usage: '43',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'amex',
      activity: 'Yesterday',
      satisfaction: '11'
    }
  ]
}

clientsTableCtrl.$inject = ['$scope', '$timeout'];
function clientsTableCtrl($scope, $timeout) {

  $scope.users = [
    {
      avatar: '1.jpg',
      status: 'active',
      name: 'Yiorgos Avraamu',
      registered: 'Jan 1, 2015',
      activity: '10 sec ago',
      transactions: 189,
      comments: 72
    },
    {
      avatar: '2.jpg',
      status: 'busy',
      name: 'Avram Tarasios',
      registered: 'Jan 1, 2015',
      activity: '5 minutes ago',
      transactions: 156,
      comments: 76
    },
    {
      avatar: '3.jpg',
      status: 'away',
      name: 'Quintin Ed',
      registered: 'Jan 1, 2015',
      activity: '1 hour ago',
      transactions: 189,
      comments: 72
    },
    {
      avatar: '4.jpg',
      status: 'offline',
      name: 'Enéas Kwadwo',
      registered: 'Jan 1, 2015',
      activity: 'Last month',
      transactions: 189,
      comments: 72
    },
    {
      avatar: '5.jpg',
      status: 'active',
      name: 'Agapetus Tadeáš',
      registered: 'Jan 1, 2015',
      activity: 'Last week',
      transactions: 189,
      comments: 72
    },
    {
      avatar: '6.jpg',
      status: 'busy',
      name: 'Friderik Dávid',
      registered: 'Jan 1, 2015',
      activity: 'Yesterday',
      transactions: 189,
      comments: 72
    }
  ]
}

function random(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

barChartCtrl.$inject = ['$scope'];
function barChartCtrl($scope) {

  var elements = 16;
  var labels = [];
  var data = [];
  var data1 = [];
  var data2 = [];

  for (var i = 0; i <= elements; i++) {
    labels.push('1');
    data.push(random(40,100));
    data1.push(random(20,100));
    data2.push(random(60,100));
  }

  $scope.labels = labels;

  $scope.data = [data];
  $scope.data1 = [data1];
  $scope.data2 = [data2];

  $scope.options = {
    showScale: false,
    scaleFontSize: 0,
    scaleShowGridLines: false,
    barStrokeWidth : 0,
    barBackground: 'rgba(221, 224, 229, 1)',

    // pointDot :false,
    // scaleLineColor: 'transparent',
  };

  $scope.colors = [{
    backgroundColor : brandInfo,
    borderColor : 'rgba(0,0,0,1)',
    highlightFill: '#818a91',
    pointborderColor: '#000'
  }];
}
