const Sequelize = require("sequelize"); //Chama o framework que faz a conexão com o banco de dados
const sequelize = new Sequelize("CAP", "root", "123456",{
host:"localhost",
dialect:"mysql"
} ); //Se conecta a database do banco CAP pelo usuário/senha, e seleciona o host local e sua
//linguagem do banco de dados.

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};