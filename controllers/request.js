var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var JSONPath = require('JSONPath');

var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({extended: false});

var requestModel = require('../models/request');
var userModel = require('../models/user');

router.get('/get/all', function (req, res, next) {
    var attributs = [];
    var values = [];
    requestModel.get_by_x_y(attributs, values, function(result){
        res.send(result);
    });
});

router.post('/get/message', urlencodedParser, function(req, res, next){
    var message = req.body.message;
    var words = message.toLowerCase().replace(/[.,\/#!$%\^&\*;:?{}=\-_`~()]/g," ").split(" ");

    var f_words = [];
    for(var i = 0; i<words.length; i++){
        if(words[i]!=""){
            f_words.push(words[i]);
        }
    }

    find_request(f_words, function(result){

        if(result){
                apply_request(result, function(result2){

                    if(result2){
                        prepare_response(result, result2, function(result3){
                            if(result2 && req.session.user){
                                save_request(req.session.user, message, result3);
                            }
                            var response = {text: result3, voice:result.voice};
                            res.send(response);
                        });
                    }
                });
        }else{
            var response = {text: "Je n'ai pas compris", voice:true};
            save_request(req.session.user, message, response.text);
            res.send(response);
        }
    });
});


function find_request(words, done){
    var attributs = [];
    var values = [];
    requestModel.get_by_x_y(attributs, values, function(result){
        var requests = result;

        for(var i = 0; i<requests.length; i++){

            var level_found = [];
            var level_required = [];
            var keywords = requests[i].keywords;

            for(var j = 0; j<keywords.length; j++){
                var ok_keyword = false;
                level_required.push(keywords[j].level);
                for(var l = 0; l<keywords[j].keyword.word.length; l++){

                    for(var k = 0; k<words.length; k++){
                        if(keywords[j].keyword.word[l]==words[k]){
                            level_found.push(keywords[j].level);
                            ok_keyword = true;
                            break;
                        }
                    }
                    if(ok_keyword){
                        break;
                    }
                }
            }

            var ok = true;
            for(var x = 0; x<level_required.length; x++){
                var index = level_found.indexOf(level_required[x]);
                if(index==-1){
                    ok = false;
                }
            }
            if(ok){
                return done(requests[i]);
            }
        }
        done(false);
    });
};

function apply_request(req, done){
    var postData = JSON.parse(req.params);

    var url = req.url;
    var options = {
        method: req.method,
        body: postData,
        json: req.json,
        url: url
    };

    request(options, function (err, res, body) {
        if (err) {
            done(false);
        }
        done(body);
    });
};

function prepare_response(req, body, done){
    var response = req.response;
    var f_step = req.response.split("[[");

    for(var i = 0; i<f_step.length; i++){
        var s_step = f_step[i].split("]]")[0];
        if(s_step){
            JSONPath({json: body, path: s_step, callback: function(rtr){
                console.log(rtr);
                response = response.replace("[["+s_step+"]]",rtr);
            }});
        }
    }
    done(response);
}

function save_request(user, order, response){
    userModel.update({_id:user._id}, {
        $push: {
            "requests": {
                date: new Date(),
                order: order,
                response: response
            }
        }
    }, function(result){
        console.log("OK");
    });
};

router.put('/set', urlencodedParser, function (req, res, next) {
    var request = req.body;

    requestModel.update({_id:request._id}, request, function(result){
        res.send(result);
    });
});

router.post('/add', urlencodedParser, function (req, res, next) {
    var request = req.body;

    requestModel.add(request, function(result){
        res.send(result);
    })
});

router.delete('/del/id=:id', function (req, res, next) {
    var id = req.params.id;

    requestModel.delete(id, function(result){
        res.send(result);
    })
});

module.exports = router;