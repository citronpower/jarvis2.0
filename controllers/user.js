var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({extended: false});

var crypto = require('../helpers/crypto');
var userModel = require('../models/user');

router.post('/login', urlencodedParser, function (req, res, next) {
    var username = req.body.username;
    var password = crypto.encrypt(req.body.password);

    var attributs = ["username", "password"];
    var values = [username, password];
    userModel.get_by_x_y(attributs, values, function(result){
        req.session.user = result[0];
        res.send(result[0]);
    })
});

router.get('/session', function (req, res, next) {
    if(req.session.user){
        res.send(true);
    }else{
        res.send(false);
    }
});

router.post('/get/id', urlencodedParser, function (req, res, next) {
    var id = req.body.id;

    var attributs = ["_id"];
    var values = [id];
    userModel.get_by_x_y(attributs, values, function(result){
        res.send(result[0]);
    })
});


module.exports = router;