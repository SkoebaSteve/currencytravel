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
  
  // set two scope variables that are used for the switching of currency calculation
  $scope.calculatorCurrent = 0;
  $scope.calculatorHistorical = 0;

  // use this later for all selected countries
  $scope.SelectedCountries = [];

  // get list of currencies with their info
  $scope.ListOfCurrencies = ListOfCurrencies.query(function(data){
  });

  $scope.CurrentExchangeRate = LatestCurrencies.query(function(data){
    var currentCurrency = data.filter(function (data) { return data.code == "USD" });
    $scope.calculatorCurrent = currentCurrency[0].currentRate;
    $scope.calculatorHistorical = currentCurrency[0].historicalRate;

    for(d in data){
      for(l in $scope.ListOfCurrencies){
        if($scope.ListOfCurrencies[l].cc === data[d].code){
          data[d].countryName = $scope.ListOfCurrencies[l].countryName;
        }
      }
    }
    updateRates();
  });

  // function for updating the rates
  var updateRates = function(){
    for(s in $scope.CurrentExchangeRate){
      $scope.CurrentExchangeRate[s].currentRate = $scope.CurrentExchangeRate[s].currentRate / $scope.calculatorCurrent;
      $scope.CurrentExchangeRate[s].historicalRate = $scope.CurrentExchangeRate[s].historicalRate / $scope.calculatorHistorical;
      $scope.CurrentExchangeRate[s].difference = ($scope.CurrentExchangeRate[s].currentRate / $scope.CurrentExchangeRate[s].historicalRate -1) *100;
    }
  }

  // get selected currency rate from SELECT 

  $scope.update = function(){

    for(c in $scope.CurrentExchangeRate){
      if($scope.CurrentExchangeRate[c].code === $scope.SelectedCurrency.cc){
        $scope.calculatorCurrent = $scope.CurrentExchangeRate[c].currentRate;
        $scope.calculatorHistorical = $scope.CurrentExchangeRate[c].historicalRate;
      }
    }

    updateRates();
  }

  // setup map
  var map = AmCharts.makeChart( "chartdiv", {
    "type": "map",
    "theme": "light",
    "projection": "miller",

    "dataProvider": {
      "map": "worldLow",
      getAreasFromMap: true
    },
    "areasSettings": {
      "autoZoom": false,
      "color": "#CDCDCD",
      "colorSolid": "#5EB7DE",
      "selectedColor": "#5EB7DE",
      "outlineColor": "#666666",
      "rollOverColor": "#88CAE7",
      "rollOverOutlineColor": "#FFFFFF",
      "selectable": true
    },
    "listeners": [ {
      "event": "clickMapObject",
      "method": function( event ) {
        // deselect the area by assigning all of the dataProvider as selected object
        map.selectedObject = map.dataProvider;

        // toggle showAsSelected
        event.mapObject.showAsSelected = !event.mapObject.showAsSelected;

        // bring it to an appropriate color
        map.returnInitialColor( event.mapObject );

        var selectedCountriesArray = [];
        // let's build a list of currently selected states
        for (var i in map.dataProvider.areas) {
          var area = map.dataProvider.areas[i];
          if (area.showAsSelected) {
            for(s in $scope.CurrentExchangeRate){
              if(area.title === $scope.CurrentExchangeRate[s].countryName){
                selectedCountriesArray.push($scope.CurrentExchangeRate[s]);
              }
            }
          }
        }

        $scope.SelectedCountries = selectedCountriesArray;
        console.log($scope.SelectedCountries);
      }
    } ]
  });
});

