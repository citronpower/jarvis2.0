var mongoose = require('mongoose');

exports.connect = function(done){
    mongoose.connect('mongodb://localhost:27017/jarvis', function(err) {
        if (err) {
            done(false);
        }else{
            done(true);
        }
    });
};

exports.close = function(done){
    mongoose.connection.close();
}

