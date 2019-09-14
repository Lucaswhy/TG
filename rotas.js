const path = require('path');
const express = require("express"); //Chama o framework que faz o req/res
const app  = express();
const mongoose = require("mongoose");
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment-timezone');

app.use(express.static(path.join(__dirname, 'public')   )); //defino que a pasta usada é a pública


    //Configurando Mongoose
    mongoose.Promise = global.Promise; 
    mongoose.connect('mongodb://localhost/CAP', {useNewUrlParser: true, useCreateIndex: true}).then(() => {
    console.log("Banco de dados rodando.");
    }).catch((erro) => {
        console.log("Falha no banco de dados. Erro: " + erro);
    })


   // Configurando Handlebars
    // Template Engine
    app.engine('handlebars', handlebars({
        defaultLayout: 'main',
        helpers: {  formatDate: (date) => {
            return moment(date).add(3,"hours").format('DD/MM/YYYY');
            },
            formatDateBD: (date) =>{
                return moment(date).add(3,"hours").format('MM/DD/YYYY'); 
            }
        }

       }));
    app.set('view engine','handlebars');
    
    //Configurando Body Parser 
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    //Configurando o sessions
    app.use(session({
        secret: "cpa2019",
        resave: true,
        saveUninitialized: true
    }));

    //Configurando o flash
    app.use(flash());

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.erro_msg = req.flash("error_msg");
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

//-------------------------------------

const PORT = 8081;
app.listen(PORT, function(){ //funcao de callback
    console.log("Servidor rodando.");
});