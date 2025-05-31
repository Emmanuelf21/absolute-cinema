import React from 'react'
import { FaStar, FaVoteYea } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const imageUrl = import.meta.env.VITE_IMG;

const CardFilme = ({filme, showLink=true}) => {
  return (
    <div className="filme-card">
            {/* pega a url da imagem e concatena com o endpoint do poster */}
            <img src={imageUrl + filme.poster_path} alt="#" />
            <h2>{filme.title}</h2>
            {/* faz o redirecionamento para os detalhes do filme e passa o id na url */}
            {showLink && <NavLink to={`/filme/${filme.id}`}>Sessões</NavLink>} 
        </div>
  )
}

export default CardFilme