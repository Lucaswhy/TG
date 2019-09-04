const db = require("./db");

const Posts = db.sequelize.define("usuario", {
    Cracha: {
        type: db.Sequelize.MEDIUMINT
    },

    Nome: {
        type: db.Sequelize.VARCHAR
    },

    CPF: {
        type: db.Sequelize.VARCHAR
    },

    Cargo: {
        type: db.Sequelize.VARCHAR
    },

    DataNascimento: {
        type: db.Sequelize.DATE
    },

    DataAdmissao: {
        type: db.Sequelize.DATE
    },

    Email: {
        type: db.Sequelize.VARCHAR
    },

    Senha: {
        type: db.Sequelize.VARCHAR
    }
});

    Posts.sync({force:true});

    module.export = Posts;

