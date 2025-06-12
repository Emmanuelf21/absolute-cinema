import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import './css/btnlogin.css'

const BtnLogin = () => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = Cookies.get('usuario_logado');
    if (usuario) {
      setUsuarioLogado(JSON.parse(usuario));
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('usuario_logado');
    setUsuarioLogado(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  if (usuarioLogado) {
    return (
      <div
        className="btn-logado"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <FaUserCircle size={24} />
        {dropdownOpen && (
          <div
            className="dropdown-menu"
          >
            <NavLink
              to="/ingressos"
              className="btn-ingressos"
              onClick={() => setDropdownOpen(false)}
            >
              Ingressos
            </NavLink>
            <button
              onClick={handleLogout} className='btn-sair'
              
            >
              Sair
            </button>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <NavLink to='/login' className='btn-logar'>
        Login/Cadastrar
      </NavLink>
    );
  }
}

export default BtnLogin;
