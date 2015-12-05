(function(){
var app = angular.module('marsApp', ['ui.router','ngAnimate','ngTouch','ngCookies']);
app.run(['$rootScope',function($rootScope){
     
             $rootScope.$on('$stateChangeStart', 
             function(event, toState, toParams, fromState, fromParams){
             $rootScope.stateName = toState.name;

             })
			}])

app.config(['$stateProvider','$urlRouterProvider','$locationProvider',
 function($stateProvider, $urlProvider, $locationProvider){

 	$locationProvider.html5Mode({
 		enabled: false,
 		requireBase: false,
 		rewriteLinks: false
 	});
 	

 	$stateProvider
 	  .state('welcome', {
 	  	url: '',
 	  	templateUrl: 'index1.html',
 	  	controller: ['$cookies','$scope','$state', function($cookies,$scope,$state){
 	  		
 	  		 $scope.swipeLeft = function() {
                   $state.go('occupation');
                 }
            $cookies.putObject('mars_user', undefined);
 	  	}],
 	  	controllerAs: 'welcome'
 	  })
 	  
 	  $stateProvider
 	  .state('occupation', {
 	  	url: '/details',
 	  	templateUrl: 'index2.html',
 	  	controller: 'registerController',
 	  	resolve: {
 		user: ['$cookies','$state', function($cookies,$state){
 			if($cookies.getObject('mars_user')) {
 				$state.go('encounters');
 			}
 		}]
 	}
    })
 	  $stateProvider
 	  .state('encounters', {
                  url: '/encounters',
                     templateUrl: 'index3.html',
                  controller: ['$scope', '$http','$state', function($scope, $http,$state){
                  var ENCOUNTERS_API_URL = 'https://red-wdp-api.herokuapp.com/api/mars/encounters';
                   $http.get(ENCOUNTERS_API_URL).then(function(response){
                   	$scope.encounters = response.data.encounters;
                   	$scope.swipeLeft = function() {
                   $state.go('alienen');
                 }
                    });
                    }]
                    })
 	  $stateProvider
 	  .state('alienen', {
 	  	url: '/report-alien',
 	  	templateUrl: 'index4.html',
 	  	controller: 'reportController',
 	  	resolve: {
 	  		user: ['$cookies', function($cookies){
 	  			if($cookies.getObject('aliens_user')){
 	  				alert('Report Filed');
 	  			}
 	  		}]
 	  	}
 	  })

 	 }])
app.controller('registerController', ['$scope', '$state','$http','$cookies', function($scope, $state,$http,$cookies){

	var API_URL_GET_JOBS = "https://red-wdp-api.herokuapp.com/api/mars/jobs";
    var API_URL_CREATE_COLONIST = "https://red-wdp-api.herokuapp.com/api/mars/colonists";

    $scope.colonist = {};
    $http.get(API_URL_GET_JOBS)
    .then(function(response){
    	$scope.jobs = response.data.jobs;

    });



	$scope.submitRegistration = function(e){
		e.preventDefault();
		if($scope.myForm.$invalid){
			$scope.invalid= true;
		} 
		
	  else {

	  	$http({
	  		method: 'POST',
	  		url: API_URL_CREATE_COLONIST,
	  		data: {colonist: $scope.colonist}
	  	}) .then(function(response){
	  	$cookies.putObject('mars_user', response.data.colonist);
	  	$state.go('encounters');
	  })
	  }
	
}
	
		
	
	
}])
app.controller('reportController', ['$scope','$state','$http','$cookies', function($scope,$state,$http,$cookies){
	var ALIEN_TYPE_API_URL = "https://red-wdp-api.herokuapp.com/api/mars/aliens";
    var ENCOUNTERS_API_URL = "https://red-wdp-api.herokuapp.com/api/mars/encounters";

	$scope.encounter = {date: '2015-10-24', colonist_id: $cookies.getObject('mars_user').id};

    $http.get(ALIEN_TYPE_API_URL)
    .then(function(response){
    	$scope.aliens = response.data.aliens;

    });
	$scope.submitReport = function(e){
		e.preventDefault();
		if($scope.alienForm.$invalid){
			$scope.invalid = true;
		}
		else {
				$http({
	  		method: 'POST',
	  		url: ENCOUNTERS_API_URL,
	  		data: {encounter: $scope.encounter}
	  	}) .then(function(response){
	  	
	  	  $state.go('encounters');
			
		})
		
	  }
	}
	
}])
})();