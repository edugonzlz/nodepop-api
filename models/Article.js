"use strict";

var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
    name: String,
    forSale: Boolean,
    price: Number,
    photo: String,
    tags: [String]
});

mongoose.model('Article',articleSchema);