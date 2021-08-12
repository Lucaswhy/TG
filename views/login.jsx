var React = require('react');
var DefaultLayout = require('./Layout');

function login(props) {

    return (
        <DefaultLayout title={props.title}>
          	<form method="POST" action="/validalogin" class="form-login">
                <h1 class="h3 mb-3 font-weight-normal">Faça login</h1>
                <div class="form-group">
                    <input type="email" id="inputEmail" class="form-control" placeholder="E-mail" name="Email" autofocus/>
                </div>
                <div class="form-group">
                    <input type="password" id="inputPassword" class="form-control" placeholder="Senha" name="Senha"/>
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>
                <a href="cadastrarusuario" class="link">Cadastrar novo usuário </a>
                <a href="esqueciminhasenha" class="link">Esqueci minha senha</a>
            </form>
            <nav class="navbar fixed-bottom navbar-dark">
                <a class="navbar-brand"></a>
            </nav>
        </DefaultLayout>
    )
}

module.exports = login;