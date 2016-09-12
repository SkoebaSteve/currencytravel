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

currencyApp.factory('LiveCurrencies', function($resource){
  return $resource('/api/current-rate', {}, {});
});

currencyApp.factory('HistoricalCurrencies', function($resource){
  return $resource('/api/historical-rate', {});
});


// create the controller and inject Angular's $scope
currencyApp.controller('MainController', function($scope, ListOfCurrencies) {

  $scope.ListOfCurrencies = ListOfCurrencies.query(function(data){
  });

});

// create the controller and inject Angular's $scope
currencyApp.controller('CurrencyController', function($scope, ListOfCurrencies, LiveCurrencies, HistoricalCurrencies) {
  
  $scope.ListOfCurrencies = ListOfCurrencies.query(function(data){});

  $scope.update = function(){

    for(c in $scope.CurrentExchangeRate){
      if($scope.CurrentExchangeRate[c].code === $scope.SelectedCurrency.cc){
        $scope.calculatorCurrent = $scope.CurrentExchangeRate[c].currentRate;
      }
    }

    for(c in $scope.HistoricalExchangeRate){
      if($scope.HistoricalExchangeRate[c].code === $scope.SelectedCurrency.cc){
        $scope.calculatorHistorical = $scope.HistoricalExchangeRate[c].currentRate;
      }
    }
  }

  $scope.calculatorCurrent = 0;
  $scope.calculatorHistorical = 0;

  $scope.CurrentExchangeRate = LiveCurrencies.query(function(data){
    var currentCurrency = data.filter(function (data) { return data.code == "USD" });
    $scope.calculatorCurrent = currentCurrency[0].currentRate;
    $scope.calculatorHistorical = currentCurrency[0].currentRate;
  });
  $scope.HistoricalExchangeRate = HistoricalCurrencies.query(function(data){

  });
});

