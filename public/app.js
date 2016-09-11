  // create the module and name it scotchApp
  var currencyApp = angular.module('CurrencyApp', ['ngRoute', 'ngResource']);

  // configure our routes
  currencyApp.config(function($routeProvider, $locationProvider) {
    $routeProvider

      // route for the home page
      .when('/', {
        templateUrl : 'views/home.html',
        controller  : 'mainController'
      })
      .when('/currency', {
        templateUrl : 'views/currencies.html',
        controller  : 'currencyController'
      });

    // change urls from hashbangs
    $locationProvider.html5Mode(true);
  });

  // setup factories to talk to the API
  currencyApp.factory('ListOfCurrencies', function($resource){
    return $resource('/api/common-currency', {}, {});
  })

  currencyApp.factory('LiveCurrencies', function($resource){
    return $resource('/api/current-rate', {id: '@_id'}, {
      'query': { method: 'GET',isArray: false}
    });
  });

  currencyApp.factory('HistoricalCurrencies', function($resource){
    return $resource('/api/historical-rate', {id: '@_id'}, {
      'query': { method: 'GET',isArray: false}
    });
  });

  // create the controller and inject Angular's $scope
  currencyApp.controller('mainController', function($scope, ListOfCurrencies) {

    $scope.ListOfCurrencies = ListOfCurrencies.query(function(data){
    });

    $scope.findCurrencies = function(form){
      console.log(form);
    }

  });

  // create the controller and inject Angular's $scope
  currencyApp.controller('currencyController', function($scope, ListOfCurrencies, LiveCurrencies, HistoricalCurrencies) {

    $scope.ListOfCurrencies = ListOfCurrencies.query(function(data){
    });
    
    $scope.LiveCurrencies = LiveCurrencies.query(function(data){
      console.log(data.quotes);
    });
    $scope.HistoricalCurrencies = HistoricalCurrencies.query(function(data){});

  });

