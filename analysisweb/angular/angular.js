var app = angular.module('app',['ngRoute']);
app.config(['$routeProvider','$httpProvider' ,function ($routeProvider,$httpProvider){
	$routeProvider
		.when('/',{
			templateUrl:'angular/template/home.html',
			controller: 'homeController'
		})
		.when('/compare/:filename',{
			templateUrl:'angular/template/compare.html',
			controller: 'compareController'
		})
		.when('/upload/:filename',{
			templateUrl:'angular/template/upload.html',
			controller: 'uploadController'
		})
		.when('/demonstrate/:algorithm',{
			templateUrl:'angular/template/demonstrate.html',
			controller: 'demonstrateController'
		})
		.otherwise({
			redirectTo:'/'
		});
}]);