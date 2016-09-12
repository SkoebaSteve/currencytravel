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

  $scope.findCurrencies = function(form){
    console.log(form);
  }

});

// create the controller and inject Angular's $scope
currencyApp.controller('CurrencyController', function($scope, ListOfCurrencies, LiveCurrencies, HistoricalCurrencies) {
  $scope.CurrentExchangeRate = LiveCurrencies.query(function(data){});
  $scope.HistoricalExchangeRate = HistoricalCurrencies.query(function(data){});
});

