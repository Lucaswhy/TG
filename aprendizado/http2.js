const express = require('express');
const app = new express();

app.use(express.static("public"));

app.get('/', function(request, response){
    response.sendFile('C:/Users/Lucas Herculano/Documents/tg/nodejs/home.html');
}).listen(8081);

console.log("O servidor rodando!");