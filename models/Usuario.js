const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Usuario  = new Schema({
    
    Cracha: {
        type: Number,
        required: true
    },
    
    Nome: {
        type: String,
        required: true
    },

    CPF: {
        type: String,
        required: true,
        validate: function(cpf){ var i = 0; // index de iteracao
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
        type: Date,
        required: true
    },

    DataAdmissao: {
        type: Date,
        required: true
    },

    Email: {
        type: String,   
        required: true
    },

    Senha: {
        type: String,
        required: true
    }
});

mongoose.model("usuario", Usuario)