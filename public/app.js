  // create the module and name it scotchApp
  var currencyApp = angular.module('CurrencyApp', ['ngRoute', 'ngResource']);

  // configure our routes
  currencyApp.config(function($routeProvider, $locationProvider) {
    $routeProvider

      // route for the home page
      .when('/', {
        templateUrl : 'views/home.html',
        controller  : 'mainController'
      });

    // change urls from hashbangs
    $locationProvider.html5Mode(true);
  });

  currencyApp.factory('ListOfCurrencies', function($resource){
    return $resource('/api/common-currency', {}, {});
  })

  // create the controller and inject Angular's $scope
  currencyApp.controller('mainController', function($scope, ListOfCurrencies) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
    $scope.ListOfCurrencies = ListOfCurrencies.query(function(data){
    });

  });
