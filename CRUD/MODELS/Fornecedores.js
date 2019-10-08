const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Fornecedores  = new Schema({
    
    codFornecedor: {
        type: Number,
        required: true
    },
    
    RazaoSocial: {
        type: String,
        required: true
    },

    CNPJ: {
        type: String,
        required: true,
        validate: function validarCNPJ(cnpj) {
 
            cnpj = cnpj.replace(/[^\d]+/g,'');
         
            if(cnpj == '') return false;
             
            if (cnpj.length != 14)
                return false;
         
            // Elimina CNPJs invalidos conhecidos
            if (cnpj == "00000000000000" || 
                cnpj == "11111111111111" || 
                cnpj == "22222222222222" || 
                cnpj == "33333333333333" || 
                cnpj == "44444444444444" || 
                cnpj == "55555555555555" || 
                cnpj == "66666666666666" || 
                cnpj == "77777777777777" || 
                cnpj == "88888888888888" || 
                cnpj == "99999999999999")
                return false;
                 
            // Valida DVs
            tamanho = cnpj.length - 2
            numeros = cnpj.substring(0,tamanho);
            digitos = cnpj.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
              soma += numeros.charAt(tamanho - i) * pos--;
              if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
                return false;
                 
            tamanho = tamanho + 1;
            numeros = cnpj.substring(0,tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
              soma += numeros.charAt(tamanho - i) * pos--;
              if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
                  return false;
                   
            return true;
            
        }
    },

    Email: {
        type: String,   
        required: true
    },

    Telefone: {
        type: String,
        required: true
    },

    Endereco: {
        type: String,
        required: true
    },

    CEP: {
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

    Estado: {
        type: String,
        required: true
    }
});

mongoose.model("fornecedor", Fornecedores)