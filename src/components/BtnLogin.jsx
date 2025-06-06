import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

const BtnLogin = () => {

    const [usuarioLogado, setUsuarioLogado] = useState(null);

    useEffect(() => {
        const usuario = Cookies.get('usuario_logado');
        if (usuario) {
            setUsuarioLogado(JSON.parse(usuario));
        }
    }, []);

    if (usuarioLogado) {
        return (
            <NavLink to='/ingressos' className='btn-logado'>
                <FaUserCircle />
            </NavLink>
        );
    } else {
        return (
            <NavLink to='/login' className='btn-logar'>
                Login/Cadastrar
            </NavLink>
        );
    }
}

export default BtnLogin