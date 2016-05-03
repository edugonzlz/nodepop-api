/**
 * Created by Edu on 29/4/16.
 */
"use strict";

var jwt = require('jsonwebtoken');
var config = require('../../local_config');

let express = require('express');
let router = express.Router();

let User = require('mongoose').model('User');
let PushToken = require('mongoose').model('PushToken');

router.post('/authenticate', function (req, res, next) {
    //Recogemos los valores que nos mandan
    let userName = req.body.name;
    let userMail = req.body.email;
    let userPass = req.body.passw;

    //Buscamos en la base de datos por nombre
    User.findUser(userName, userMail, userPass, res, function (err, user) {
        if (err){
            return (err);
        }
        //Creamos el token con la clave del fichero de configuracion y lo devolvemos
        let token = jwt.sign({id:user._id},config.jwt.secret, {expiresIn:60*60*2*24});

        return res.json({success:true, token:token})
    })
});

router.put('/pushtoken', function (req, res) {

    let userName = req.body.name;
    let userMail = req.body.email;
    let userPass = req.body.passw;

    let pushToken = req.query.pushtoken;

    User.findUser(userName, userMail, userPass, res, function (err, res, user) {
        if (err){
            return (err);
        }
        //Guardamos el token
        PushToken.saveToken(user, pushToken, function (err, saved ) {
            if (err){
                return res.status(500).json({success: false, error: err});
            }
            return res.json({success:true, saved:saved });
        });
    })
});

module.exports= router;