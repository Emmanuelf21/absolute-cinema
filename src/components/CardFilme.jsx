import React from 'react'
import { NavLink } from 'react-router-dom'

const imageUrl = import.meta.env.VITE_IMG;

const CardFilme = ({filme}) => {
  
  return (
    <NavLink to={`/filme/${filme.id}`} id={filme.id} className="filme">
            
            {/* pega a url da imagem e concatena com o endpoint do poster */}
            <div className="banner-filme"><img src={imageUrl + filme.poster_path} alt="#" /></div>
            {/* faz o redirecionamento para os detalhes do filme e passa o id na url */}
            {/* {showLink && <NavLink to={`/filme/${filme.id}`}>Sessões</NavLink>}  */}
    </NavLink>
  )
}

export default CardFilme