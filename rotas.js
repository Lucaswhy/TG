const path = require('path');
const express = require("express"); //Chama o framework que faz o req/res
const app  = express();

app.use(express.static(path.join(__dirname, '/public'))); //defino que a pasta usada é a pública

const Sequelize = require("sequelize"); //Chama o framework que faz a conexão com o banco de dados
const sequelize = new Sequelize("CAP", "root", "123456",{
host:"localhost",
dialect:"mysql"
} ); //Se conecta a database do banco CAP pelo usuário/senha, e seleciona o host local e sua
//linguagem do banco de dados.

const handlebars = require('express-handlebars');
   // Configurando
    // Template Engine
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine','handlebars');

const bodyParser = require('body-parser');
//Body Parser configuração
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//rotas para os handlebars

//app.get("/", function(req,res){   //Com HTML
//    res.sendFile(__dirname +'/public/login'); //defino a página inicial do código
//});

// app.get("/parametros/:nome/:cargo", function(req, res){ //parâmetros a ser enviado, exemplo
//    res.send(req.params);
//});

//ROTAS DE LOGIN
app.get("/", function(req,res){
    res.render(__dirname +'/public/login');
});

app.post("/home", function(req,res){
    res.render(__dirname +'/public/home');
});

//app.post("/teste", function(req,res){
//    res.send("OK");
//});

//ROTAS DE CADASTRO
app.get("/cadastrarusuario", function(req,res){
    res.render(__dirname +'/public/cadastrarusuario');
});

app.get("/cadastrarcontas", function(req,res){
    res.render(__dirname +'/public/cadastrarcontas');
});

app.get("/cadastrarfornecedor", function(req,res){
    res.render(__dirname +'/public/cadastrarfornecedor');
});

app.get("/cadastrarbancos", function(req,res){
    res.render(__dirname +'/public/cadastrarbancos');
});
//ROTAS DE CONSULTAS
app.get("/consultarcontas", function(req,res){ 
    res.render(__dirname +'/public/consultarcontas');
});

app.get("/consultarfornecedor", function(req,res){ 
    res.render(__dirname +'/public/consultarfornecedor');
});

app.get("/consultarbancos", function(req,res){ 
    res.render(__dirname +'/public/consultarbancos');
});
//-------------------------------------
sequelize.authenticate().then(function(){
    console.log("Banco de dados rodando.");
}
).catch(function(erro){
    console.log("Falha no banco de dados, erro: " + erro);   
}); //verifica conexão com o banco

app.listen(8081, function(){ //funcao de callback
    console.log("Servidor rodando.");
});