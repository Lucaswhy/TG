const express = require('express');
const router = express.Router();

router.get("/cadastrarfornecedor", function(req,res){
    res.render('../public/cadastrarfornecedor');
});

router.get("/consultarfornecedor", function(req,res){ 
    res.render('../public/consultarfornecedor');
});


module.exports = router