import React from 'react'
import BtnLogin from './BtnLogin'
import { NavLink } from 'react-router-dom'
import './css/header.css'
import { BiSearchAlt2 } from 'react-icons/bi'


const Header = () => {
  return (
    <header className="container-header flex">
        <div className="flex">
            <div className="flex flex-logo">
                <NavLink to='/'><h1>Absolute Cinema</h1></NavLink>
                <div className="search-bar flex">
                    <input className="input-search" type="text" placeholder="Digite aqui o que você procura"/>
                    <button className="btn-search"><BiSearchAlt2 /></button>
                </div>
            </div>
            <div className="user">
                <BtnLogin/>
            </div>
        </div>
    </header>
  )
}

export default Header