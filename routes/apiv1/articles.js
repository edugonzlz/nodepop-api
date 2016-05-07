/**
 * Created by Edu on 26/4/16.
 */
"use strict";

let express = require("express");
let router = express.Router();

let mongoose = require('mongoose');
let Article = mongoose.model('Article');

let jwtAuth = require('../../lib/jwtAuth');
let mobileDetect = require('mobile-detect');
let errorManager = require('../../lib/errorManager');

//Requerimos autenticacion para uso del modulo
//router.use(jwtAuth());

router.get('/', function (req, res) {

   //Recogemos los parametros de la busqueda
    let name = req.query.name;
    let price = req.query.price;
    let forSale = req.query.forSale;
    let tags = req.query.tags;

    let start = parseInt(req.query.start) || 0;
    let limit = parseInt(req.query.limit) || null;
    let sort = req.query.sort || null;

    //Creamos un objeto de busqueda con los parametros
    let searchCriteria = {};
    if (typeof name !== 'undefined'){
        searchCriteria.name = new RegExp('^' + name, 'i');
    }

    if (typeof price !== 'undefined'){
        let splitPrice = price.split('-');
        //precio unico
        if (splitPrice.length === 1) {
            searchCriteria.price = splitPrice[0];
        }
        //precio minimo
        else if (splitPrice[1] === ''){
            searchCriteria.price = {$gte: splitPrice[0]};
        }
        //precio maximo
        else if (splitPrice[0] === ''){
            searchCriteria.price = {$lte: splitPrice[1]};
        }
        //precio minimo y maximo
        else{
            searchCriteria.price = {$gte: splitPrice[0], $lte: splitPrice[1]};
        }
    }

    if (typeof forSale !== 'undefined'){
        searchCriteria.forSale = forSale;
    }
    if (typeof tags !== 'undefined'){
        searchCriteria.tags = {$in: tags};
    }

    //Llamamos a la busqueda con el critrerio de busqueda y paginacion
    return Article.list(searchCriteria, start, limit, sort, function (err, rows) {
        if (err){
            return errorManager(err, req, res);
        }
        return res.json({success:true, rows:rows});
    })
});

// router.get('/*.jpg', function (req, res) {
//
// });

router.get('/tags',function (req, res) {
    
    Article.tagList(function (err, tagList) {
        if (err){
            return errorManager(err, req, res);
        }
        return res.json({success:true, rows:tagList});
    })
});

router.post("/", function (req, res) {
    
    let article = req.body;

    Article.saveArticle(article, function (err, saved) {
        if (err){
            return errorManager(err, req, res);
        }
        console.log('Articulo guardado', saved);
        return res.json({success:true, saved:saved});
    });
});

module.exports = router;