var mongoose = require('mongoose');

var responseSchema = new mongoose.Schema({
    response: {type: String, required: true},
    success: {type: Boolean, default: true}
});

var ResponseModel = mongoose.model('responses', responseSchema);

exports.add = function(response, done){
    var nResponse = new ResponseModel(response);

    nResponse.save(function(err, result){
       if(err){
           done(false)
       }else{
           done(result)
       }
    });
};

exports.get_by_x_y = function(attributs, values, done){
    var query = ResponseModel.find(null);

    if(attributs.length == values.length){
        for (var i = 0; i < attributs.length; i++) {
            query.where(attributs[i], values[i]);
        }
    }

    query.exec(function(err, result){

        if(err){
            done(false);
        }else{
            done(result);
        }
    });
};

exports.update = function(attributs, values ,done){
    ResponseModel.update(attributs, values, { multi : false }, function(err, result){
        if(err){
            done(false)
        }else{
            done(true);
        }
    });

};

exports.delete = function(id, done){
    ResponseModel.remove({_id: id}, function(err){
        if(err){
            done(false);
        }else{
            done(true);
        }
    });
};