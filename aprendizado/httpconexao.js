const express = require("express");
const app  = express();
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile("C:/Users/Lucas Herculano/Documents/tg/nodejs/public/home.html");
});

app.get("/parametros/:nome/:cargo", function(req, res){ //parametros
    res.send("Olá " + req.params.nome + "!" 
    + "\nCargo:" + req.params.cargo);
});

app.listen(8081, function(){ //funcao de callback
    console.log("Servidor rodando.");
});