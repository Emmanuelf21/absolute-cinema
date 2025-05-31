import React from 'react'
import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

const BtnLogin = () => {
    const cookieValue = Cookies.get('myCookie');

    if(cookieValue){
        return (
          <NavLink to='/' className='btn-logado'>
            <FaUserCircle/>
          </NavLink>
        )
    }
    else{
        return(
            <NavLink to='/' className='btn-logar'>
                Login/Cadastrar
            </NavLink>
        )
    }
}

export default BtnLogin