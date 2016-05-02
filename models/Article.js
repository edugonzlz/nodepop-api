"use strict";

let mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    name: String,
    forSale: Boolean,
    price: Number,
    photo: String,
    tags: [String]
});

articleSchema.statics.list = function (filter, start, limit, sort, callback) {

    //TODO pendiente filtrar por tags
    let query = Article.find(filter);
    query.skip(start);
    query.limit(limit);
    query.sort(sort);
    
    return query.exec(callback);
};

articleSchema.statics.saveArticle = function (newArticle, callback) {

    let article = new Article (newArticle);

    article.save(function (err, saved) {
        if (err){
            next(err);
            return;
        }
        return callback(err,saved);
    })
};

var Article = mongoose.model('Article',articleSchema);