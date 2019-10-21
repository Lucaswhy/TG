const mongoose = require("mongoose");

// Mongoose configuração.
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/CAP").then(() =>{
    console.log("Mongodb rodando!");
}).catch((erro) =>{
    console.log("Erro na conexão: " +erro);
})

const UsuarioSchema = mongoose.Schema({
    nome: {
        type: String,
        require: false
    },
    sobrenome: {
        type: String,
        require: false
    },
    
    email: {
        type: String
    },

    idade: {
        type: Number
    }

});

const Victor = mongoose.model('usuariomongo',UsuarioSchema);

new Victor({
nome: "Victor",
sobrenome: "Lima",
email: "emailvv@email.com",
idade: 20
}).save().then(() =>{
    console.log("Usuario criado com sucesso!");
}).catch((erro) =>{
    console.log("Erro na criação de usuario: " + erro);
});



//const Conta = mongoose.model('Conta', ContaSchema);
//Conta.create({
//    name : "Brasilia",
//    preco :  200.00,
//    data : 15/05/2019
//}).then().catch();