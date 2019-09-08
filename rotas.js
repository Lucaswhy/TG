const path = require('path');
const express = require("express"); //Chama o framework que faz o req/res
const app  = express();
//const mongoose = require("mongoose");

app.use(express.static(path.join(__dirname, 'public'))); //defino que a pasta usada é a pública

   // Configurando Handlebars
    // Template Engine
const handlebars = require('express-handlebars');
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine','handlebars');
    
    //Configurando Body Parser 
const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

//rotas para os handlebars

//app.get("/", function(req,res){   //Com HTML
//    res.sendFile(__dirname +'/public/login'); //defino a página inicial do código
//});

// app.get("/parametros/:nome/:cargo", function(req, res){ //parâmetros a ser enviado, exemplo
//    res.send(req.params);
//});

//ROTAS DE LOGIN

    const login = require(__dirname + "/routes/login");

    app.use('/', login);

//ROTAS DE CONTAS

    const contas = require(__dirname + "/routes/contas");

    app.use('/', contas);

// ROTAS DE FORNECEDOR  

    const fornecedor = require(__dirname + "/routes/fornecedor");

    app.use('/', fornecedor);

//ROTAS DE BANCOS

    const bancos = require(__dirname + "/routes/bancos");

    app.use('/', bancos);

//-------------------------------------

const PORT = 8081;
app.listen(PORT, function(){ //funcao de callback
    console.log("Servidor rodando.");
});