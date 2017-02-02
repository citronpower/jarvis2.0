/**
 * Created by Louis on 25.01.2017.
 */
angular.module("app").controller("homeController", function ($scope, $location, $anchorScroll, userFactory, requestFactory, sharedService){

    var listener;
    var speaker;

    $scope.init = function(){

        init_speaker();
        init_listener();
        document.getElementById("inputMessage").focus();

        var id = {id: sharedService.getUser()._id};

        userFactory.check_session(id).then(function(result){
            if(result){
                userFactory.get_by_id(id).then(function(result2){
                    $scope.requests = result2.requests;
                });
            }else{
                sharedService.setUser(null);
                $location.path( '/login' );
            }
        });
    };

    function init_speaker(){
        try{
            speaker	= new RobotSpeaker();
        }
        catch(ex){
            speaker = null;
            document.getElementById("status").innerHTML = ex;
        }
    }

    function init_listener(){
        try{
            listener = new AudioListener();
        }
        catch(ex){
            listener = null;
            document.getElementById("status").innerHTML = ex;
        }
    }

    $scope.send_message = function(message){
        var message = {message: message};
        requestFactory.get_message(message).then(function(result){
            if(result.voice && speaker){
                speaker.speak("fr", result.text);
            }
            $scope.requests.push({date:new Date, order:message.message, response:result.text});
            $scope.message = "";
        });
    };

    $scope.listen = function(){
        if(listener){
            listener.listen("fr", function(text) {
                console.log(text);
                $scope.send_message(text);
            });
        }
    };

    $scope.close_modal = function(){
        if(listener){
            listener.stop();
        }
    };
});

