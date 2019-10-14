const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Contas  = new Schema({
    
    tipoConta: {
        type: String,
        default: "Padrão"
    },
    
    codConta: {
        type: Number,
        required: true,
        unique: true
    },

    valConta: {
        type: String,
        required: true
    },

    nomeFornecedor: {
        type: String
    },

    Juros: {
        type: String
    },

    Multa: {
        type: String
    },

    Desconto: {
        type: String
    },

    dataEmissao: {
        type: Date,
        required: true
    },

    dataVencimento: {
        type: Date,
        required: true
    },

    codigoBarras: {
        type: String
    },

    Observacao: {
        type: String
    },

    Descricao: {
        type: String
    },

    Situacao: {
        type: String
    }
});

mongoose.model("conta", Contas)