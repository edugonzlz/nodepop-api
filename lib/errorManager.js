/**
 * Created by Edu on 7/5/16.
 */
"use strict";

let errorLib = require('../errorLib.json');

let errorManager = function (err, req, res) {

    //Si el error que nos llega se llama Error es que es de los que manejamos y vamos a traducir
    if (err.name === 'Error'){
        var error = eval('errorLib.' + err.message +'.' + req.lang || es);
        var status = 401;
    }else {
        status = 500;
    }
    return res.status(status).json({success:false, message: error, error: err});
};

module.exports = errorManager;
