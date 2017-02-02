var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    login : { type : String, required: true},
    password: {type: String, required: true},
    admin : {type: Boolean, default: false},
    requests: [{
            date: {type: Date, required: true},
            order: {type: String, required: true},
            response: {type: String, required: true}
        }]
});

var UserModel = mongoose.model('users', userSchema);

exports.add = function(user, done){
    var nUser = new UserModel(user);

    nUser.save(function(err, result){
       if(err){
           done(false)
       }else{
           delete result.password;
           done(result)
       }
    });
};

exports.get_by_x_y = function(attributs, values, limit, done){
    var query = UserModel.find(null);

    if(attributs.length == values.length){
        for (var i = 0; i < attributs.length; i++) {
            query.where(attributs[i], values[i]);
        }
    }

    query.slice("requests", -limit);

    query.populate("requests.request");

    query.exec(function(err, result){

        if(err){
            done(false);
        }else{
            for(var i = 0; i<result.length; i++){
                result[i].password = "";
            }
            done(result);
        }
    });
};

exports.update = function(attributs, values, done){
        UserModel.update(attributs, values, { multi : false }, function(err, result){
        if(err){
            done(false)
        }else{
            done(true);
        }
    });

};

exports.delete = function(id, done){
    UserModel.remove({_id: id}, function(err){
        if(err){
            done(false);
        }else{
            done(true);
        }
    });
};