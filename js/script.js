(function(){
var app = angular.module('marsApp', ['ui.router','ngAnimate','ngCookies']);
app.run(['$rootScope',function($rootScope){
     
             $rootScope.$on('$stateChangeStart', 
             function(event, toState, toParams, fromState, fromParams){
             $rootScope.stateName = toState.name;

             })
			}])

app.config(['$stateProvider','$urlRouterProvider','$locationProvider',
 function($stateProvider, $urlProvider, $locationProvider){

 	$locationProvider.html5Mode({
 		enabled: true,
 		requireBase: false,
 		rewriteLinks: false
 	});
 	

 	$stateProvider
 	  .state('welcome', {
 	  	url: '/',
 	  	templateUrl: 'index1.html',
 	  	controller: ['$cookies', function($cookies){
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
 		user: ['$cookies', function($cookies){
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
 	  	controller: ['$cookies', function($cookies){
 	  		$cookies.putObject('aliens_user', undefined);
 	  	}],
 	  	controllerAs: 'encounters'
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

	

	  $scope.alien = {};
    $http.get(ALIEN_TYPE_API_URL)
    .then(function(data){
    	$scope.aliens = data.data.aliens;

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
	  		data: {alien: $scope.alien}
	  	}) .then(function(data){
	  	$cookies.putObject('aliens_user', data.data.alien);
	  
			
		})
		alert('Report Filed');
	  }
	}
	
}])
})();