/**
 * Created by Edu on 29/4/16.
 */
"use strict";

let jwt = require('jsonwebtoken');
let config = require('../../local_config');

let express = require('express');
let router = express.Router();

let User = require('mongoose').model('User');
let PushToken = require('mongoose').model('PushToken');
let hash = require('hash.js');

router.post('/register',function (req, res, next) {
    //Recogemos los valores que nos mandan
    let userName = req.body.name;
    let userMail = req.body.email;
    let userPass = hash.sha256().update(req.body.passw).digest('hex');
    console.log(userPass);

    //Comprobamos si ya existe
    User.findUser(userName, userMail, userPass, res, function (err, user) {
        if (err){
            return (err);
        }
        //Si ya existe
        if (user){
            return res.json({success:false, err:'El usuario ya existe'});
        }
        //Si no existe creamos uno
        User.saveUser(userName, userMail, userPass, function (err, saved) {
            if (err){
                return res.status(500).json({success:false, err:err});
            }
            return res.json({success:true, saved:saved})
        });

    })
});

router.post('/authenticate', function (req, res, next) {
    //Recogemos los valores que nos mandan
    let userName = req.body.name;
    let userMail = req.body.email;
    let userPass = hash.sha256().update(req.body.passw).digest('hex');

    //Buscamos el usuario en la base de datos
    User.findUser(userName, userMail, userPass, res, function (err, user) {
        if (err){
            return (err);
        }
        if (!user){
            return res.status(401).json({success:false, error:'Authetication failed. User name or email is not found'});
        }
        if (user.passw !== userPass){
            return res.status(401).json({success:false, error:'Authentication failed. The password is not correct'});
        }
        //Creamos el token con la clave del fichero de configuracion y lo devolvemos
        let token = jwt.sign({id:user._id},config.jwt.secret, {expiresIn:60*60*2*24});

        return res.json({success:true, token:token})
    })
});



router.put('/pushtoken', function (req, res) {

    let userName = req.body.name;
    let userMail = req.body.email;
    let userPass = hash.sha256().update(req.body.passw).digest('hex');

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