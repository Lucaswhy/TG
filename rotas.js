const path = require('path');
const express = require("express"); //Chama o framework que faz o req/res
const app  = express();
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment-timezone');
const passport = require("passport");
require("./config/auth")(passport);
    
app.use(express.static(path.join(__dirname + '/public')   )); //defino que a pasta usada é a pública

    //Configurando Mongoose
    mongoose.Promise = global.Promise; 
    mongoose.connect('mongodb://localhost/CAP', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}).then(() => {
    console.log("Banco de dados rodando.");
    }).catch((erro) => {
        console.log("Falha no banco de dados. Erro: " + erro);
    })

    //Configurando o sessions
    app.use(session({
        secret: "cpa2019",
        resave: true,
        saveUninitialized: true,
        cookie: {maxAge : (2 * 60 * 60 * 1000)}
    }));

    app.use(express.json());
    app.use(express.urlencoded({extended : false})); 

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jsx');
    app.engine('jsx', require('express-react-views').createEngine());

    //Configurando passport
    app.use(passport.initialize());
    app.use(passport.session());
    //Configurando o flash
    app.use(flash());

    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error");
        res.locals.user = req.user || null;
        next();
    });


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

//ROTAS DE AGENCIAS

    const agencias = require(__dirname + "/routes/agencias");

    app.use('/', agencias);

//ROTAS DE CONTA BANCARIA

    const contabancaria = require(__dirname + "/routes/contabancaria");

    app.use('/', contabancaria);    

//-------------------------------------

const PORT = 8081;
app.listen(PORT, function(){ //funcao de callback
    console.log("Servidor rodando.");
});