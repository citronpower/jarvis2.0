angular.module("app").controller("loginController", function ($scope, $location, userFactory, sharedService){

        $scope.init = function(){

        };

        $scope.login = function(username, password){
                var user = {username: username, password: password};

                userFactory.login(user).then(function(result){
                        if(result){
                                sharedService.setUser(result);
                                $scope.m_user = sharedService.getUser();
                                $location.path( '/home' );
                        }
                });
        };

});