angular.module("app").controller("mainController", function ($scope, $location, userFactory, sharedService){

        $scope.init = function(){
            $scope.m_user = sharedService.getUser();
        };

        $scope.logout = function(){
            sharedService.setUser(null);
            $location.path( '/login' );
        };

});