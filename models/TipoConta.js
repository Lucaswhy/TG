const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TipoContas  = new Schema({
    
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
        type: Boolean,
        default: false
    },

    Desconto: {
        type: Boolean,
        default: false
    },

    Juros: {
        type: Boolean,
        default: false
    }, 

    codigoBarras: {
        type: Boolean,
        default: false
    },

    Descricao: {
        type: Boolean,
        default: false
    },

    Observacao: {
        type: Boolean,
        default: false
    }
    
});

mongoose.model("tipoconta", TipoContas)