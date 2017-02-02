var mongoose = require('mongoose');

var requestSchema = new mongoose.Schema({
    keywords: [{level: {type: Number, required:true},
                keyword: {type: mongoose.Schema.Types.ObjectId, ref: 'keywords'}}],
    params: {type : String, required: true},
    method: {type : String, default:"post"},
    json: {type : Boolean, default:false},
    url: {type : String, required: true},
    response: {type: String, default: "Oui chef!"},
    voice: {type: Boolean, default:false}
});

var RequestModel = mongoose.model('requests', requestSchema);

exports.add = function(request, done){
    var nRequest = new RequestModel(request);

    nRequest.save(function(err, result){
       if(err){
           done(false)
       }else{
           done(result)
       }
    });
};

exports.get_by_x_y = function(attributs, values, done){
    var query = RequestModel.find(null);

    if(attributs.length == values.length){
        for (var i = 0; i < attributs.length; i++) {
            query.where(attributs[i], values[i]);
        }
    }

    query.populate("keywords.keyword");

    query.exec(function(err, result){

        if(err){
            done(false);
        }else{
            done(result);
        }
    });
};

exports.update = function(attributs, values ,done){
    RequestModel.update(attributs, values, { multi : false }, function(err, result){
        if(err){
            done(false)
        }else{
            done(true);
        }
    });

};

exports.delete = function(id, done){
    RequestModel.remove({_id: id}, function(err){
        if(err){
            done(false);
        }else{
            done(true);
        }
    });
};