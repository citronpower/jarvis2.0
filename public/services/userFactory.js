angular.module("app").factory("userFactory", ['$http', function ($http){


    var login = function(user) {
        return $http.post("/user/login", user)
		.then(function(response) {
            return response.data;
		}, function(response) {
            return false;
		});
    };

    var check_session = function(id) {
        return $http.get("/user/session")
            .then(function(response) {
                return response.data;
            }, function(response) {
                return false;
            });
    };

    var get_by_id = function(id) {
        return $http.post("/user/get/id", id)
            .then(function(response) {
                return response.data;
            }, function(response) {
                return false;
            });
    };

    return {
        login: login,
        check_session: check_session,
        get_by_id: get_by_id
    };
}
]);