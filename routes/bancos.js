const express = require('express');
const router = express.Router();

router.get("/cadastrarbancos", function(req,res){ 
    res.render('../public/cadastrarbancos');
});

router.get("/consultarbancos", function(req,res){ 
    res.render('../public/consultarbancos');
});

module.exports = router