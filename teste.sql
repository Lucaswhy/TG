CREATE TABLE usuario(
    Cracha MEDIUMINT NOT NULL AUTO_INCREMENT,
    Nome VARCHAR(50),
    CPF VARCHAR(20),
    Cargo VARCHAR(20),
    DataNascimento date,
    DataAdmissao date,
    Email VARCHAR(100),
    Senha VARCHAR(50),
    PRIMARY KEY (Cracha)
);

CREATE TABLE usuario_endereco(
    Cracha MEDIUMINT NOT NULL AUTO_INCREMENT,
    Logradouro VARCHAR(50),
    Numero INT,
    Bairro VARCHAR(20),
    Cidade VARCHAR(20),
    Estado VARCHAR(20),
    FOREIGN KEY(Cracha) REFERENCES usuario(Cracha)
);

INSERT INTO usuario(Cracha,Nome,CPF,Cargo,DataNascimento,DataAdmissao,Email,Senha) VALUES(
    1,
    "Lucas Herculano",
    "40425536807",
    "Banqueiro",
    1999/03/22,
    2019/09/01,
    "lucas_herculano_2010@hotmail.com",
    "batata"
);

INSERT INTO usuario_endereco(Cracha,Logradouro,Numero,Bairro,Cidade,Estado) VALUES(
    1,
    "Rua Assis de Castro",
    307,
    "Jardim Vitoria",
    "Mairinque",
    "São Paulo"
);