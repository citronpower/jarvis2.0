angular.module("app").factory("requestFactory", ['$http', function ($http){


    var get_all = function() {
        return $http.get("/request/get/all")
		.then(function(response) {
            return response.data;
		}, function(response) {
            return false;
		});
    };

    var get_message = function(message) {
        return $http.post("/request/get/message", message)
            .then(function(response) {
                return response.data;
            }, function(response) {
                return false;
            });
    };

    var set = function(request) {
        return $http.put("/request/set", request)
            .then(function(response) {
                return response.data;
            }, function(response) {
                return false;
            });
    };

    var add = function(request) {
        return $http.post("/request/add", request)
            .then(function(response) {
                return response.data;
            }, function(response) {
                return false;
            });
    };

    var del = function(id) {
        return $http.delete("/request/del/id="+id)
            .then(function(response) {
                return response.data;
            }, function(response) {
                return false;
            });
    };

    return {
        get_all: get_all,
        get_message: get_message,
        set: set,
        add: add,
        del: del
    };
}
]);