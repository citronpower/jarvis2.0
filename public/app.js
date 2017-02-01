var app = angular.module('app', ['ngRoute', 'ngStorage', 'ngAnimate', 'ngSanitize']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
				.when("/home", {
					templateUrl : "templates/home.html",
					controller: "homeController"
				}).when("/login", {
					templateUrl : "templates/login.html",
					controller: "loginController"
				}).when("/params", {
					templateUrl : "templates/params.html",
					controller: "paramsController"
				}).otherwise({redirectTo:'/home'});
}]);

app.run(['$rootScope', '$location', '$anchorScroll', '$routeParams', 'sharedService', function ($rootScope, $location, $anchorScroll, $routeParams, sharedService) {

	$rootScope.$on('$routeChangeStart', function (event, next) {
			var user = sharedService.getUser();

			if(user==null || user.username == ""){
				$location.path( '/login' );
			}
	});

	$rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
		if($location.hash()) $anchorScroll();
	});

}]);
