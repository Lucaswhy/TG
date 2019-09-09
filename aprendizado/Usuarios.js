const db = require("./db");

const Usuarios = db.sequelize.define("usuarios", {
    Cracha: {
        type: db.Sequelize.MEDIUMINT
    },

    Nome: {
        type: db.Sequelize.STRING
    },

    CPF: {
        type: db.Sequelize.STRING
    },

    Cargo: {
        type: db.Sequelize.STRING
    },

    DataNascimento: {
        type: db.Sequelize.DATE
    },

    DataAdmissao: {
        type: db.Sequelize.DATE
    },

    Email: {
        type: db.Sequelize.STRING
    },

    Senha: {
        type: db.Sequelize.STRING
    }
});

//  Usuario.sync({force:true});

    module.exports = Usuarios;

