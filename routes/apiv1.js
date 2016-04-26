/**
 * Created by Edu on 23/4/16.
 */
"use strict";

var express = require("express");
var router = express.Router();

router.post("/", function (req, res) {
    res.send("Mostrando todos los articulos de Nodepop");
});

module.exports = router;