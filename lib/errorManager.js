/**
 * Created by Edu on 7/5/16.
 */
"use strict";

let errorLib = require('../errorLib.json');

let errorManager = function (err, req, res) {

    //Si el error que nos llega se llama Error, es que lo manejamos nosotros y vamos a traducirlo
    //todo: no funciona bien del todo, buscar otro sistema
    if (err.name === 'Error'){
        var errMessage = err.message || 'UNKNOWN_ERROR';
        var error = eval('errorLib.' + errMessage +'.' + req.lang);
        var status = 400;
    }else {
        status = 500;
    }
    // TODO: - Devolver siempre JSON, por ejemplo,
    // al solicitar una página que no exista (http://localhost:3000/api/v1/noexiste) también conviene devolverlo
    return res.status(status).json({success:false, message: error, error: err});
};

module.exports = errorManager;
