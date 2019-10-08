const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Contas  = new Schema({
    
    tipoConta: {
        type: String,
        required: true
    },
    
    codConta: {
        type: Number,
        required: true
    },

    valConta: {
        type: String,
        required: true,
    },

    nomeFornecedor: {
        type: String,   
        required: true
    },

    Juros: {
        type: String,
        required: true
    },

    Multa: {
        type: String,
        required: true
    },

    Desconto: {
        type: String,
        required: true
    },

    dataEmissao: {
        type: String,
        required: true
    },

    dataVencimento: {
        type: String,
        required: true
    },

    codigoBarras: {
        type: String,
        required: true
    },

    Observacao: {
        type: String,
        required: true
    },

    Descricao: {
        type: String,
        required: true
    },
});

mongoose.model("conta", Contas)