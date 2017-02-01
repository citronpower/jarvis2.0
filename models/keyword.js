var mongoose = require('mongoose');

var keywordSchema = new mongoose.Schema({
    word: [{type: String, required: true}]
});

var KeywordModel = mongoose.model('keywords', keywordSchema);

exports.add = function(keyword, done){
    var nKeyword = new KeywordModel(keyword);

    nKeyword.save(function(err, result){
       if(err){
           console.log(err);
           done(false);
       }else{
           console.log(result)
           done(result);
       }
    });
};

exports.get_by_x_y = function(attributs, values, done){
    var query = KeywordModel.find(null);

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
    KeywordModel.update(attributs, values, { multi : false }, function(err, result){
        if(err){
            done(false)
        }else{
            done(true);
        }
    });
};

exports.delete = function(id, done){
    KeywordModel.remove({_id: id}, function(err){
        if(err){
            done(false);
        }else{
            done(true);
        }
    });
};