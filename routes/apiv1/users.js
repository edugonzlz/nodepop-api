/**
 * Created by Edu on 29/4/16.
 */
"use strict";

//TODO: exigir autenticacion y generar token

let express = require('express');
let router = express.Router();

let User = require('mongoose').model('User');

router.post('/authenticate', function (req, res) {
    //Recogemos los valores que nos mandan
    let userName = req.body.name;
    let userPass = req.body.passw;
    console.log(req.body.name, userPass);

    //Buscamos en la base de datos
    User.findOne({name:userName}).exec(function (err, user) {
        if (err){
            return res.status(500).json({success:false, error:err});
        }
        if (!user){
            return res.status(401).json({success:false, error:'Authetication failed. User dont exist'});
        }
        if (user.passw !== userPass){
            return res.status(401).json({success:false, error:'Authentication failed. The password is not correct'});
        }
        
        let token = '';
        
        return res.json({success:true, token:token})
    })
});

module.exports= router;