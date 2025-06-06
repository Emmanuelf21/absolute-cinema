import React, { useState } from 'react'
import './css/login.css'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ login_email: '', senha: '' });
    const [cadastroData, setCadastroData] = useState({
        nome: '',
        usuario: '',
        email: '',
        telefone: '',
        data_nasc: '',
        cpf: '',
        senha: '',
        confirmar_senha: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
          });
      
          if (response.ok) {
            const user = await response.json();
            // Armazenar login no cookie
            // Cookies.set('usuario_logado', JSON.stringify(user), { expires: 1 }); // expira em 1 dia
            Cookies.set('usuario_logado', JSON.stringify(user));
            navigate('/');
            window.location.reload();
            // Redirecionar ou atualizar o estado da página aqui, se quiser
          } else {
            const erro = await response.json();
            alert(erro.erro);
          }
        } catch (error) {
          alert('Erro ao tentar logar');
        }
      };

    const handleCadastro = async (e) => {
        e.preventDefault();
        if (cadastroData.senha !== cadastroData.confirmar_senha) {
            alert('As senhas não coincidem!');
            return;
        }

        const { confirmar_senha, ...cadastroPayload } = cadastroData;

        try {
            const response = await fetch('http://localhost:5000/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cadastroPayload)
            });
            const result = await response.json();
            alert(JSON.stringify(result));
        } catch (error) {
            alert('Erro ao cadastrar.');
        }
    };

    const handleChange = (e, setFunc, state) => {
        const { name, value } = e.target;
        setFunc({ ...state, [name]: value });
    };
    
    return (
        <div className="container">
            {/* Login */}
            <div className="form-section flex-column">
                <h2>Entrar</h2>
                <button className="social-btn">Google</button>
                <button className="social-btn">Apple</button>
                <button className="social-btn">Facebook</button>

                <div className="divider">OU</div>

                <form className='flex-column' onSubmit={handleLogin}>
                    <input
                        name="login_email"
                        placeholder="Email / Nome de usuário"
                        value={loginData.login_email}
                        onChange={(e) => handleChange(e, setLoginData, loginData)}
                        required
                    />
                    <input
                        name="senha"
                        type="password"
                        placeholder="SENHA"
                        value={loginData.senha}
                        onChange={(e) => handleChange(e, setLoginData, loginData)}
                        required
                    />
                    <button type="submit" className="btn">Entrar</button>
                </form>
            </div>

            {/* Cadastro */}
            <div className="form-section flex-column">
                <h2>Cadastre-se</h2>
                <form className='form-cadastro flex-column' onSubmit={handleCadastro}>
                    <div className="row">
                        <input
                            name="nome"
                            placeholder="Nome"
                            value={cadastroData.nome}
                            onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
                            required
                        />
                        <input
                            name="usuario"
                            placeholder="Nome de usuário"
                            value={cadastroData.usuario}
                            onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
                            required
                        />
                    </div>
                    <div className='row'>
                        <input
                            name="email"
                            placeholder="Email"
                            value={cadastroData.email}
                            onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
                            required
                        />
                        <input
                            type='tel'
                            name="telefone"
                            placeholder="(00) 00000-0000"
                            value={cadastroData.telefone}
                            onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
                        />
                    </div>
                    <div className="row">
                        <input
                            type='date'
                            name="data_nasc"
                            placeholder="00/00/0000"
                            value={cadastroData.data_nasc}
                            onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
                        />
                        <input
                            name="cpf"
                            placeholder="CPF"
                            value={cadastroData.cpf}
                            onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
                        />
                    </div>
                    <div className="row">
                        <input
                            name="senha"
                            type="password"
                            placeholder="SENHA"
                            value={cadastroData.senha}
                            onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
                            required
                        />
                        <input
                            name="confirmar_senha"
                            type="password"
                            placeholder="CONFIRME A SENHA"
                            value={cadastroData.confirmar_senha}
                            onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}

export default Login