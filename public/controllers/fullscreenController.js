/**
 * Created by Louis on 25.01.2017.
 */
angular.module("app").controller("fullscreenController", function ($scope, $location, $anchorScroll, userFactory, requestFactory, sharedService){

    var listener;
    var speaker;

    $scope.isListening = false;

    $scope.init = function(){

        init_speaker();
        init_listener()

        var id = {id: sharedService.getUser()._id};

        userFactory.check_session(id).then(function(result){
            if(!result){
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

    $scope.listen = function(){
        if(listener){
            $scope.isListening = true;
            listener.listen("fr", function(text) {
                $scope.isListening = false;
                send_message(text);
            });
        }
    };

    function send_message(message){
        if(message){
            var message = {message: message};
            requestFactory.get_message(message).then(function(result){
                if(result.voice && speaker){
                    speaker.speak("fr", result.text);
                }
                $scope.requests.push({date:new Date, order:message.message, response:result.text});
                $scope.message = "";
            });
        }
    };
});

