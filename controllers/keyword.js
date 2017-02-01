var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({extended: false});

var keywordModel = require('../models/keyword');
var requestModel = require('../models/request');

router.get('/get/all', function (req, res, next) {
    var attributs = [];
    var values = [];
    keywordModel.get_by_x_y(attributs, values, function(result){
        res.send(result);
    });
});

router.post('/add', urlencodedParser, function (req, res, next) {
    var keyword = req.body;

    keywordModel.add(keyword, function(result){
        res.send(result);
    })
});

router.put('/set', urlencodedParser, function (req, res, next) {
    var keyword = req.body;

    keywordModel.update({_id:keyword._id}, keyword, function(result){
        res.send(result);
    });
});

router.delete('/del/id=:id', function (req, res, next) {
    var id = req.params.id;


    requestModel.update({"keywords.keyword":id}, {
        $pull: {
            "keywords": { "keyword": id }
        }
    }, function(result){
        if(result){
            keywordModel.delete(id, function(result2){
                res.send(result2);
            });
        }
    });

});

module.exports = router;