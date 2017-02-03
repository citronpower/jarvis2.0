var app = angular.module('app', ['ngRoute', 'ngStorage', 'ngAnimate', 'ngSanitize']);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
				.when("/login", {
					templateUrl : "templates/login.html",
					controller: "loginController"
				}).when("/home", {
					templateUrl : "templates/home.html",
					controller: "homeController"
				}).when("/fullscreen", {
					templateUrl : "templates/fullscreen.html",
					controller: "fullscreenController"
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
