angular.module('app')
  .controller('homeController', function ($rootScope,$scope,$routeParams,$interval,$http) {
  		$interval.cancel($rootScope.interval);
  		$http({
	        method: 'GET',
	        url: '/filerecord'
	    }).then(function (response) {
	    	$scope.records = response.data;
	    }, function (response) {
	        console.log(response);
	    });
	    $scope.SelectTime = function(namerecord){
	    	$http({
		        method: 'GET',
		        url: '/timerecord/'+namerecord
		    }).then(function (response) {
		    	$scope.times = response.data;
		    }, function (response) {
		        console.log(response);
		    });
		    $scope.name = namerecord;
	    }
});