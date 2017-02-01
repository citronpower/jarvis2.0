/**
 * Created by Rana on 14-12-20.
 */


    /**
     * a robotic speaker who speaks with given text and language
     */
    RobotSpeaker: function RobotSpeaker() {
        try{
            this.u = new SpeechSynthesisUtterance();
        }
        catch(ex){
            throw "This browser does not have support for webspeech api";
        }
        this.u.rate = 1.0;
        this.u.onend = function(event) {
            //TODO
        };
        this.speak = function(lang, text){
            this.u.lang = lang;
            this.u.text = text;
            speechSynthesis.speak(this.u);
        };
    }

    /**
     * An audio listener which will listen and convert spoken sounds to text
     * @param lang
     * @param callback
     * @constructor
     */
    AudioListener: function AudioListener(callback) {
        try{
            this.listener = new webkitSpeechRecognition();
        }
        catch(ex){
            throw "This browser does not have support for webspeech api";

        }

        if('SpeechRecognition' in window) {
            this.listener.continuous = true;
        }
        if(callback) {
            this.callBack = callback;
        }
        this.listener.lang = "fr";
        //this.listener.interimResults = true;
        var me = this;

        //-----Events---------
        this.listener.onresult = function(event) {
            if (event.results.length > 0) {
                var result = event.results[event.results.length-1];
                if(result.isFinal) {
                    me.callBack(result[0].transcript);
                }
            }
        };
        this.listener.onstart = function() {
            console.log('onstart');
        };
        this.listener.onend  = function() {
            console.log('onend');
            $('#myModal').modal('toggle');
        };
        this.listener.onerror   = function() {
            console.log('onerror');
            $('#myModal').modal('toggle');
        };
        this.listener.onsoundstart = function(event) {
            console.log('soundstart');
        };
        this.listener.onspeechstart = function(event) {
            console.log('speechstart');
        };
        this.listener.onsoundend = function(event) {
            console.log('soundstart');
        };
        //-----End Events---------

        this.isContinuous = function() {
            return this.listener.continuous;
        };

        /**
         * Start listening with given language(optional, defaults is english)
         * @param lang
         */
        this.listen = function(lang, callback) {
            if(lang) {
                this.listener.lang = lang;
            }
            if(callback) {
                this.callBack = callback;
            }
            this.listener.start();
        };

        /**
         * Stop listening
         * @param lang
         */
        this.stop = function() {
            this.listener.stop();
            console.log("audio listener stopped");
        };
    }
