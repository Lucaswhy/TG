var React = require('react');

function DefaultLayout(props) {
  return (
  <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
        <title>{props.title}</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" integrity="sha256-rByPlHULObEjJ6XQxW/flG2r+22R5dKiAoef+aXWfik=" crossorigin="anonymous" />
        <link rel="stylesheet" type="text/css" href="./css/styles.css"/>
      </head>
      <body>
        <nav className="navbar navbar-expand-lg navbar-dark">
          <a className="navbar-brand text-light">Hydrochorus</a>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <form method="POST" action="/home">
                  <button>
                    <a className="nav-link" href="http://localhost:8081/home">Home</a>
                  </button>
                </form>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Contas
                </a>
                <div className="dropdown-menu" aria-labelledby="contas">
                  <a className="dropdown-item" href="http://localhost:8081/Conta">Cadastrar Conta</a>
                  <a className="dropdown-item" href="http://localhost:8081/consultarcontas">Consultar Contas</a>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Fornecedores
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <a className="dropdown-item" href="http://localhost:8081/cadastrarfornecedor">Cadastrar Fornecedores</a>
                  <a className="dropdown-item" href="http://localhost:8081/consultarfornecedor">Consultar Fornecedores</a>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Bancos
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <a className="dropdown-item" href="http://localhost:8081/cadastrarbancos">Cadastrar Bancos</a>
                  <a className="dropdown-item" href="http://localhost:8081/consultarbancos">Consultar Bancos</a>
                  <hr/>
                  <a className="dropdown-item" href="http://localhost:8081/cadastraragencias">Cadastrar Agências</a>
                  <a className="dropdown-item" href="http://localhost:8081/consultaragencia">Consultar Agências</a>
                  <hr/>
                  <a className="dropdown-item" href="http://localhost:8081/cadastrarcontabancaria">Cadastrar Contas Bancárias</a>
                  <a className="dropdown-item" href="http://localhost:8081/consultarcontabancaria">Consultar Contas Bancárias</a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="http://localhost:8081/relatorio">Relatórios</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="http://localhost:8081/simulacao">Simulação</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Pagar
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a className="dropdown-item" href="http://localhost:8081/pagarconta">Pagar</a>
                    <a className="dropdown-item" href="http://localhost:8081/retorno">Consultar Retorno</a>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <a className="navbar-brand text-light">
                <a href="/logout"><img src="imagens/logout.png" width="40" height="40"/></a>
              </a>
            </ul>
          </div>
	      </nav>
      {props.children}
    </body>
    </html>
  );
}

module.exports = DefaultLayout;