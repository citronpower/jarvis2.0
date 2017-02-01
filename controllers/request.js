var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

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
    var words = message.toLowerCase().split(" ");
    find_request(words, function(result){

            if(result){
                apply_request(result, function(result2){
                    if(result2){
                        save_request(req.session.user, message, result);
                    }
                    res.send(result2);
                });
            }else{
                res.send(result);
            }
    });
});


function find_request(words, done){
    var attributs = [];
    var values = [];
    requestModel.get_by_x_y(attributs, values, function(result){
        var requests = result;

        for(var i = 0; i<requests.length; i++){

            //var nbr_ok = 0;
            var level_found = [];
            var level_required = [];
            var keywords = requests[i].keywords;

            for(var j = 0; j<keywords.length; j++){
                var ok_keyword = false;
                level_required.push(keywords[j].level);
                for(var l = 0; l<keywords[j].keyword.word.length; l++){

                    for(var k = 0; k<words.length; k++){
                        if(keywords[j].keyword.word[l]==words[k]){
                            //console.log(keywords[j]);
                            level_found.push(keywords[j].level);
                            ok_keyword = true;
                            break;
                        }
                    }
                    if(ok_keyword){
                        break;
                    }
                }
                /*if(ok_keyword){
                    nbr_ok++;
                }*/
            }
            console.log(requests)
            console.log("BEFORE")
            console.log(level_required);
            console.log(level_found);

            var ok = true;
            for(var x = 0; x<level_required.length; x++){
                var index = level_found.indexOf(level_required[x]);
                console.log(index);
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
        done(req);
    });
};

function save_request(user, order, req){
    userModel.update({_id:user._id}, {
        $push: {
            "requests": {
                date: new Date(),
                order: order,
                request: req._id
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