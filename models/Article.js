"use strict";

let mongoose = require('mongoose');
let async = require('async');

let articleSchema = mongoose.Schema({
    name: {type:String, index: true},
    forSale: {type:Boolean, index: true},
    price: {type:Number, index: true},
    photo: String,
    tags: {type:[String], index: true}
});

articleSchema.statics.list = function (filter, start, limit, sort, callback) {

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
            return callback(err);
        }
        return callback(err,saved);
    })
};

articleSchema.statics.tagList = function (callback) {

    let query = Article.distinct('tags');
    return query.exec(callback);
};

var Article = mongoose.model('Article',articleSchema);