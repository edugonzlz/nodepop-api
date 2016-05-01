/**
 * Created by Edu on 26/4/16.
 */
"use strict";

let express = require("express");
let router = express.Router();

let mongoose = require('mongoose');
let Article = mongoose.model('Article');

let jwtAuth = require('../../lib/jwtAuth');

//Requerimos contraseña para uso del modulo

router.use(jwtAuth());

router.get('/', function (req, res, next) {
   //Recogemos los parametros de la busqueda
    let name = req.query.name;
    let minPrice = req.query.price;
    let maxPrice = req.query.maxPrice;
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
    //TODO pendiente arreglar las combinaciones de precios
    if (typeof minPrice !== 'undefined'){
        if (typeof maxPrice !== 'undefined'){
            searchCriteria.price = {$gte: minPrice, $lte: maxPrice};
        }else{
            searchCriteria.price = minPrice;
        }
    }
    if (typeof forSale !== 'undefined'){
        searchCriteria.forSale = forSale;
    }
    if (typeof tags !== 'undefined'){
        searchCriteria.tags = tags;
    }

    //Llamamos a la busqueda con los parametros
    return Article.list(searchCriteria, start, limit, sort, function (err, rows) {
        if (err){
            return res.json({success:false, error:err})
        }
        return res.json({success:true, rows:rows});
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