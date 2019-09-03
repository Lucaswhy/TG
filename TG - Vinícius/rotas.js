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

app.get("/", function(req,res){
    res.render(__dirname +'/public/login'); //defino a página inicial do código
});


app.get("/parametros/:nome/:cargo", function(req, res){ //parametros
    res.send(req.params);
});

sequelize.authenticate().then(function(){
    console.log("Banco de dados rodando.");
}
).catch(function(erro){
    console.log("Falha no banco de dados, erro: " + erro);   
}); //verifica conexão com o banco

app.listen(8081, function(){ //funcao de callback
    console.log("Servidor rodando.");
});