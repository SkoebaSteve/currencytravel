  // create the module and name it scotchApp
  var currencyApp = angular.module('CurrencyApp', ['ngRoute']);

  // configure our routes
  currencyApp.config(function($routeProvider) {
    $routeProvider

      // route for the home page
      .when('/', {
        templateUrl : 'views/home.html',
        controller  : 'mainController'
      })
  });

  // create the controller and inject Angular's $scope
  currencyApp.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
  });
