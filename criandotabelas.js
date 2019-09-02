const Sequelize = require("sequelize");
const sequelize = new Sequelize('Teste','root','123456',{
    host:"localhost",
    dialect:"mysql"
})

const Postagem = sequelize.define("ContasTeste", { //Criando uma tabela, nome da tabela e as colunas
    Titulo: {
        type: Sequelize.STRING
    },
    Conteudo: {
        type: Sequelize.TEXT
    },
    Valor:{
        type: Sequelize.INTEGER
    }
})

Postagem.sync({force: true}) //Forçar o mysql criar a tabela, assim que criada, transformar em
//comentário, pois, vai sempre criar de novo quando for rodado.

Postagem.create({
    Titulo: "Casinha",
    Conteúdo: "Boletão de 1500",
    Valor: 500
});
//Inserindo valores na tabela!