const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tipoContas  = new Schema({
    
    codTipoConta: {
        type: Number,
        required: true,
        unique: true
    },

    nomeTipoConta:{
        type: String,
        required: true,
        unique: true
    },

    Multa: {
        type: Boolean
    },

    Desconto: {
        type: Boolean
    },

    Juros: {
        type: Boolean
    }, 

    codigoBarras: {
        type: Boolean
    },

    Descricao: {
        type: Boolean
    },

    Observacao: {
        type: Boolean
    }
    
});

mongoose.model("tipoconta", tipoContas)