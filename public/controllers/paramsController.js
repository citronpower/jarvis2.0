angular.module("app").controller("paramsController", function ($scope, $location, requestFactory, keywordFactory, userFactory, sharedService){

        $scope.s_request = null;

        $scope.init = function(){
                var id = {id: sharedService.getUser()._id};

                userFactory.check_session(id).then(function(result){
                        if(result){
                                requestFactory.get_all().then(function(result){
                                        $scope.requests = result;
                                });
                                keywordFactory.get_all().then(function(result){
                                        $scope.keywords = result;
                                });
                        }else{
                                sharedService.setUser(null);
                                $location.path( '/login' );
                        }
                });
        };

        $scope.add_request = function(){
                $scope.s_request = null;

                for(var i = 0; i<$scope.keywords.length; i++) {
                        $scope.keywords[i].selected = false;
                        $scope.keywords[i].level = "";
                }
        };

        $scope.select_request = function(request){
                $scope.s_request = request;

                for(var i = 0; i<$scope.keywords.length; i++){
                        $scope.keywords[i].selected = false;
                        $scope.keywords[i].level = "";

                        for(var j = 0; j<request.keywords.length; j++){
                                if($scope.keywords[i]._id==request.keywords[j].keyword._id){
                                        $scope.keywords[i].selected = true;
                                        $scope.keywords[i].level = request.keywords[j].level;
                                }
                        }
                }
        };

        $scope.update_request = function(request){
                if($scope.form_request.$valid){
                        var keywords = [];

                        for(var i = 0; i<$scope.keywords.length; i++){
                                if($scope.keywords[i].selected){
                                        keywords.push({
                                                level:$scope.keywords[i].level,
                                                keyword: $scope.keywords[i]._id
                                        });
                                }
                        }
                        request.keywords = keywords;

                        if(!request._id){
                                requestFactory.add(request).then(function(result){
                                        if(result){
                                                $scope.requests.push(result);
                                                $scope.s_request = result;
                                        }
                                });
                        }else{
                                requestFactory.set(request).then(function(result){
                                        if(result){
                                                console.log("UPDATE")
                                        }
                                });
                        }
                }
        };

        $scope.delete_request = function(request){
                requestFactory.del(request._id).then(function(result){
                        if(result){
                                var index = $scope.requests.indexOf(request);
                                if (index > -1) {
                                        $scope.requests.splice(index, 1);
                                        $scope.add_request();
                                }
                        }
                });

        }

        $scope.check_keyword = function(keyword){
                if(keyword.selected){
                        keyword.level = 3;
                }else{
                        keyword.level = "";
                }
        };

        $scope.add_keyword = function(){
                $scope.keywords.push({word:[], update_mode:true});
        };

        $scope.update_keyword = function(keyword){
                if(keyword.update_mode){
                        if(keyword.word.length>0){
                                if(keyword.word.constructor !== Array){
                                        keyword.word = keyword.word.replace(/ /g,'');
                                        keyword.word = keyword.word.split(',');
                                }

                                if(!keyword._id){
                                        keywordFactory.add(keyword).then(function(result){
                                                if(result){
                                                        result.update_mode = false;
                                                        $scope.keywords[$scope.keywords.length-1] = result;
                                                }
                                        });
                                }else{
                                        keywordFactory.set(keyword).then(function(result){
                                                if(result){
                                                        keyword.update_mode = false;
                                                }
                                        });
                                }
                        }
                }else{
                        keyword.update_mode = true;
                }
        };

        $scope.delete_keyword = function(keyword){
                keywordFactory.del(keyword._id).then(function(result){
                        if(result){
                                var index = $scope.keywords.indexOf(keyword);
                                if (index > -1) {
                                        $scope.keywords.splice(index, 1);
                                }
                        }
                });
        };

});