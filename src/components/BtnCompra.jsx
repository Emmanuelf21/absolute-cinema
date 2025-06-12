import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';

const BtnCompra = ({confirmarCompra}) => {
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    useEffect(() => {
        const usuario = Cookies.get('usuario_logado');
        if (usuario) {
            setUsuarioLogado(JSON.parse(usuario));
        }
    }, []);

    if (usuarioLogado) {
        return (
            <button className="confirmar" onClick={confirmarCompra}>
          Confirmar
        </button>
        );
    } else {
        return (
            <NavLink to='/login' className='confirmar'>
                Confirmar
            </NavLink>
        );
    }
}

export default BtnCompra