angular.module('app')
  .controller('homeController', function ($rootScope,$scope,$routeParams,$interval) {
  		$interval.cancel($rootScope.interval);
});