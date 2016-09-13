// create the module and name it scotchApp
var currencyApp = angular.module('currencyApp', ['ngRoute', 'ngResource']);

// configure our routes
currencyApp.config(function($routeProvider, $locationProvider) {
  $routeProvider

    // route for the home page
    .when('/', {
      templateUrl : 'views/home.html',
      controller  : 'MainController'
    })
    .when('/currency', {
      templateUrl : 'views/currencies.html',
      controller  : 'CurrencyController'
    });

  // change urls from hashbangs
  $locationProvider.html5Mode(true);
});

// setup factories to talk to the API
currencyApp.factory('ListOfCurrencies', function($resource){
  return $resource('/api/common-currency', {}, {});
});

currencyApp.factory('LatestCurrencies', function($resource){
  return $resource('/api/current-rate', {}, {});
});

// create the controller and inject Angular's $scope
currencyApp.controller('MainController', function($scope, ListOfCurrencies) {

  $scope.ListOfCurrencies = ListOfCurrencies.query(function(data){
  });

});

// create the controller and inject Angular's $scope
currencyApp.controller('CurrencyController', function($scope, ListOfCurrencies, LatestCurrencies) {
  
  $scope.calculatorCurrent = 0;
  $scope.calculatorHistorical = 0;
  var areasArray= [];


  $scope.ListOfCurrencies = ListOfCurrencies.query(function(data){
    
    for(l in data){
      if(data[l].countrycode !== ""){
         areasArray.push({"id":data[l].countrycode});
      }
    }
    console.log(areasArray);
    generateMap();
  });

  updateRates = function(){
    for(s in $scope.CurrentExchangeRate){
      $scope.CurrentExchangeRate[s].currentRate = $scope.CurrentExchangeRate[s].currentRate / $scope.calculatorCurrent;
      $scope.CurrentExchangeRate[s].historicalRate = $scope.CurrentExchangeRate[s].historicalRate / $scope.calculatorHistorical;
      $scope.CurrentExchangeRate[s].difference = ($scope.CurrentExchangeRate[s].currentRate / $scope.CurrentExchangeRate[s].historicalRate -1) *100
    }
  }

  $scope.update = function(){

    for(c in $scope.CurrentExchangeRate){
      if($scope.CurrentExchangeRate[c].code === $scope.SelectedCurrency.cc){
        $scope.calculatorCurrent = $scope.CurrentExchangeRate[c].currentRate;
        $scope.calculatorHistorical = $scope.CurrentExchangeRate[c].historicalRate;
      }
    }

    updateRates();
  }

  $scope.CurrentExchangeRate = LatestCurrencies.query(function(data){
    var currentCurrency = data.filter(function (data) { return data.code == "USD" });
    $scope.calculatorCurrent = currentCurrency[0].currentRate;
    $scope.calculatorHistorical = currentCurrency[0].historicalRate;

    updateRates();
  });

  generateMap = function(){

    var map = AmCharts.makeChart( "chartdiv", {

      "type": "map",
      "theme": "light",
      "projection": "miller",

      "dataProvider": {
        "map": "worldLow",
        "areas": areasArray
      },
      "areasSettings": {
        "autoZoom": false,
        "selectedColor": "#CC0000"
      },
      "export": {
        "enabled": false,
        "position": "bottom-right"
      }
    } );
  }
});

