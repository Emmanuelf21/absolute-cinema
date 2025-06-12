import React, { useEffect, useState } from 'react'
import './css/cardIngresso.css'
const imageUrl = import.meta.env.VITE_IMG;
const filmesURL = import.meta.env.VITE_API_MOVIE;
const apiKey = import.meta.env.VITE_API_KEY;

const CardIngresso = ({ ingresso }) => {
    const [filme, setFilme] = useState()

    const getFilme = async () => {
        const movieURL = `${filmesURL}${ingresso.tmdb}?${apiKey}`
        const response = await fetch(movieURL);
        const data = await response.json();
        setFilme(data)
    }

    useEffect(() => {
        getFilme()
    }, [])
    if (!filme) return <p>Carregando ingresso...</p>;
    return (
        <div className='container-ingresso flex'>
            <img src={imageUrl + filme.poster_path} alt="#" />
            <div className='flex-column'>
                <h2>{ingresso.nome_filme}</h2>
                <div className='info-sessao flex-column'>
                    <h3>Sala {ingresso.numero_sala}</h3>
                    <h3>Horário: {ingresso.horario}</h3>
                    <h3>Assento: {ingresso.fileira} - {ingresso.assento}</h3>
                </div>
            </div>
        </div>
    )
}

export default CardIngresso