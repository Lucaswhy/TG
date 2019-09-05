const path = require('path');
const Usuarios = require('./models/Usuarios');
const express = require("express"); //Chama o framework que faz o req/res
const app  = express();

app.use(express.static(path.join(__dirname, '/public'))); //defino que a pasta usada é a pública

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
    req.body.nome;
    res.render(__dirname +'/public/login');
});

app.get("/home", function(req,res){
    Usuarios.findAll().then(function(usuarios){
    res.render(__dirname + '/public/home', {Nome: "lulu"});
    })
});

app.post("/validacadastro", function(req,res){
    Usuarios.create({
        Cracha: req.body.Cracha,
        Nome: req.body.Nome,
        CPF: req.body.CPF,
        Cargo: req.body.Cargo,
        DataNascimento: req.body.DataNascimento,
        DataAdmissao: req.body.DataAdmissao,
        Email: req.body.Email, 
        Senha: req.body.Senha
    }).then(function(){
    res.redirect('/usuariocadastrado');
    }).catch(function(erro){
        res.send("Usuário não cadastrado. Erro:" + erro);
    });
});

app.get("/usuariocadastrado", function(req,res){
    res.render(__dirname + '/public/usuariocadastrado')
});

app.get("/usuariodeletar/:Cracha", function(req,res){
    Usuarios.destroy({where: {'Cracha' : req.params.Cracha}}).then(function(){
        res.send("Postagem deletada com sucesso.");
    }).catch(function(erro){
        res.send("Usuário não deletado. Erro:" + erro);
    })
});

app.get('/consultarusuario', function(req,res){
 Usuarios.findAll({order: [['Cracha','ASC']]}).then(function(usuarios){
    console.log(usuarios);
    res.render(__dirname + '/public/consultarusuario', {usuarios: usuarios});
})
});

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

app.listen(8081, function(){ //funcao de callback
    console.log("Servidor rodando.");
});