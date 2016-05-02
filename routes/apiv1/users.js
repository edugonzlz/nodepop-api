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
    //TODO añadir busqueda con email
    User.findOne({email:userMail}).exec(function (err, user) {
        if (err){
            return res.status(500).json({success:false, error:err});
        }
        if (!user){
            return res.status(401).json({success:false, error:'Authetication failed. User name or email is not found'});
        }
        if (user.passw !== userPass){
            return res.status(401).json({success:false, error:'Authentication failed. The password is not correct'});
        }
        
        //Creamos el token con la clave del fichero de configuracion y lo devolvemos
        let token = jwt.sign({id:user._id},config.jwt.secret, {expiresIn:60*60*2*24});

        //Guardamos el token
        PushToken.saveToken(user, token);

        return res.json({success:true, token:token})
    })
});

module.exports= router;