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
  currencyApp.controller('MainController', function($scope, ListOfCurrencies) {

    $scope.ListOfCurrencies = ListOfCurrencies.query(function(data){
    });

    $scope.findCurrencies = function(form){
      console.log(form);
    }

  });

  // create the controller and inject Angular's $scope
  currencyApp.controller('CurrencyController', function($scope, ListOfCurrencies, LiveCurrencies, HistoricalCurrencies) {

    var currencyWithValues = [];
    $scope.ListOfCurrencies = ListOfCurrencies.query(function(data){
      for(var i in data){
        console.log(data[i].cc);
        // console.log(data[i].name);
      }
    });

    $scope.LiveCurrencies = LiveCurrencies.query(function(data){
      // for(var i in data.quotes){
      //   console.log(i);
      //   console.log(data.quotes[i]);
      // }
    });
    $scope.HistoricalCurrencies = HistoricalCurrencies.query(function(data){});

  });

