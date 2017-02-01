angular.module("app").factory("keywordFactory", ['$http', function ($http){

    var get_all = function() {
        return $http.get("/keyword/get/all")
		.then(function(response) {
            return response.data;
		}, function(response) {
            return false;
		});
    };

    var add = function(keyword) {
        return $http.post("/keyword/add", keyword)
            .then(function(response) {
                return response.data;
            }, function(response) {
                return false;
            });
    };

    var set = function(keyword) {
        return $http.put("/keyword/set", keyword)
            .then(function(response) {
                return response.data;
            }, function(response) {
                return false;
            });
    };

    var del = function(id) {
        return $http.delete("/keyword/del/id="+id)
            .then(function(response) {
                return response.data;
            }, function(response) {
                return false;
            });
    };

    return {
        get_all: get_all,
        add:add,
        set:set,
        del:del
    };
}
]);