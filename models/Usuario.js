const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Usuario  = new Schema({
    
    Cracha: {
        type: Number,
        required: true,
        unique: true
    },
    
    Nome: {
        type: String,
        required: true
    },

    CPF: {
        type: String,
        required: true,
        unique: true,
        validate: function(cpf){ var i = 0; // index de iteracao

            if(cpf == "00000000000"){
                return false;
            }

            if(cpf == "11111111111"){
                return false;
            }

            if(cpf == "22222222222"){
                return false;
            }

            if(cpf == "33333333333"){
                return false;
            }

            if(cpf == "44444444444"){
                return false;
            }

            if(cpf == "55555555555"){
                return false;
            }

            if(cpf == "66666666666"){
                return false;
            }

            if(cpf == "77777777777"){
                return false;
            }

            if(cpf == "88888888888"){
                return false;
            }

            if(cpf == "99999999999"){
                return false;
            }

            var somatoria = 0;
            var cpf = cpf.toString().split("");

            var dv11 = cpf[cpf.length - 2]; // mais significativo
            var dv12 = cpf[cpf.length - 1]; // menos significativo
            cpf.splice(cpf.length - 2, 2); // remove os digitos verificadores originais
    
            for(i = 0; i < cpf.length; i++) {
              somatoria += cpf[i] * (10 - i);
            }
    
            var dv21 = (somatoria % 11 < 2) ? 0 : (11 - (somatoria % 11));
            cpf.push(dv21);
            somatoria = 0;
    
            for(i = 0; i < cpf.length; i++) {
              somatoria += cpf[i] * (11 - i);
            }
            
            var dv22 = (somatoria % 11 < 2) ? 0 : (11 - (somatoria % 11));
        
            if (dv11 == dv21 && dv12 == dv22) {
              return true
            } else {
              return false
                }
            }
    }, 

    Cargo: {
        type: String,
        required: true
    },

    DataNascimento: {
        type: Date
    },

    DataAdmissao: {
        type: Date
    },

    Logradouro: {
        type: String,
        required: true
    },

    Numero: {
        type: Number,
        required: true
    },

    Bairro: {
        type: String,
        required: true
    },

    Cidade: {
        type: String,
        required: true
    },

    Estado:{
        type: String
    },

    Email: {
        type: String,   
        required: true
    },

    Senha: {
        type: String,
        required: true
    },

    LoginStatus: {
     type: Boolean   
    },
    //Permissões de Cadastro
    cadConta: {
        type: Boolean
    },

    conConta: {
        type: Boolean
    },

    editConta: {
        type: Boolean
    },

    delConta: {
        type: Boolean
    },
    //Permissões de Fornecedor
    cadForn: {
        type: Boolean
    },

    conForn: {
        type: Boolean
    },

    editForn: {
        type: Boolean
    },

    delForn: {
        type: Boolean
    },
    //Permissões de Banco
    cadBanco: {
        type: Boolean
    },

    conBanco: {
        type: Boolean
    },

    editBanco: {
        type: Boolean
    },

    delBanco: {
        type: Boolean
    },

    //Permissão de funcionalidades

    gerarSimulacao: {
        type: Boolean
    },

    emitirRelatorio: {
        type: Boolean
    },

    gerarRemessa: {
        type: Boolean
    }

});

mongoose.model("usuario", Usuario)