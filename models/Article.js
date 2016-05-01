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

var Article = mongoose.model('Article',articleSchema);