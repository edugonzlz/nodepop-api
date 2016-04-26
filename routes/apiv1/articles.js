/**
 * Created by Edu on 26/4/16.
 */
"use strict";

var express = require("express");
var router = express.Router();

var mongoose = require('mongoose');
var Article = mongoose.model('Article');

router.get("/", function (req, res, next) {

    //res.send("Mostrando todos los articulos de Nodepop");
    var query = Article.find({});

    return query.exec(function (err, articles) {
        if (err){
            next(err);
            return;
        }
        //Devolvemos el resultado
        res.json({success: true, rows: articles});
       //return mongoose(null, articles);
    });
});

router.post("/", function (req, res, next) {
    var article = new Article(req.body);

    article.save(function (err, saved) {
        if (err){
            next(err);
            return;
        }
        //Respondemos con el resultado
        res.json({success:true, saved:saved});
    })
});

module.exports = router;