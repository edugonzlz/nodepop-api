/**
 * Created by Edu on 26/4/16.
 */
"use strict";

let express = require("express");
let router = express.Router();

let mongoose = require('mongoose');
let Article = mongoose.model('Article');

// router.get("/all", function (req, res, next) {
//
//     //res.send("Mostrando todos los articulos de Nodepop");
//     let query = Article.find({});
//
//     return query.exec(function (err, articles) {
//         if (err){
//             next(err);
//             return;
//         }
//         //Devolvemos el resultado
//         res.json({success: true, rows: articles});
//        //return mongoose(null, articles);
//     });
// });

router.get('/', function (req, res, next) {
   //Recogemos los parametros de la busqueda
    let name = req.query.name;
    let price = req.query.price;
    let forSale = req.query.forSale;
    let tags = req.query.tags;

    let start = parseInt(req.query.start) || 0;
    let limit = parseInt(req.query.limit) || null;
    let sort = req.query.sort || null;

    let searchCriteria = {};
    if (typeof name !== 'undefined'){
        // searchCriteria.name = new RegExp('^' + name + 'i');
        searchCriteria.name = new RegExp('^' + name, 'i');
    }
    if (typeof price !== 'undefined'){
        searchCriteria.price = price;
        // searchCriteria.price.$gte = price;
        // searchCriteria.price.$lte = price;
    }
    if (typeof forSale !== 'undefined'){
        searchCriteria.forSale = forSale;
    }
    if (typeof tags !== 'undefined'){
        searchCriteria.tags = tags;
    }

    //Llamamos a la busqueda
    Article.list(searchCriteria, start, limit, sort, function (err, rows) {
        if (err){
            return res.json({success:false, error:err})
        }
        res.json({success:true, rows:rows});
    })
});

router.post("/", function (req, res, next) {
    let article = new Article(req.body);

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