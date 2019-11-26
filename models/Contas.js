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
        type: Number,
        required: true
    },

    nomeFornecedor: {
        type: String
    },

    Juros: {
        type: String
    },

    Multa: {
        type: Number
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

    dataPagamento: {
        type: Date,
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
    },

    Pagador: {
        type: String,
        default: "Conta ainda não foi paga."
    }
});

mongoose.model("conta", Contas)