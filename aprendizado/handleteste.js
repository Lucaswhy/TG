
const express = require("express"); //Chama o framework que faz o req/res
const app  = express();

const handlebars = require('express-handlebars');
   // Configurando
    // Template Engine
    app.engine('handlebars', handlebars({
        defaultLayout: 'main'}));
    app.set('view engine','handlebars');

app.get("/teste", function(req,res){
    res.render(__dirname +'/views/layouts/login')
});


app.listen(8081, function(){ //funcao de callback
    console.log("Servidor rodando.");
});