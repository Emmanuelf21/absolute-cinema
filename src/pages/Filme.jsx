import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom';

import './css/filme.css'

const filmesURL = import.meta.env.VITE_API_MOVIE;
const apiKey = import.meta.env.VITE_API_KEY;
const imageUrl = import.meta.env.VITE_IMG;

const Filme = () => {
    const { id } = useParams();
    const [filme, setFilme] = useState(null);
    const [filmeDB, setFilmeDB] = useState(null);

    const getFilmeDb = async () => {
        const res = await fetch(`http://localhost:5000/filme/${id}`)
        const data = await res.json()
        setFilmeDB(data);
    }

    const getFilme = async (url) => {
        const res = await fetch(url);
        const data = await res.json();
        setFilme(data);
        // getFilmeDb();
    }

    useEffect(() => {
        const filmeURL = `${filmesURL}${id}?${apiKey}`;
        getFilmeDb();
        getFilme(filmeURL);
    }, [])

    if (!filme) return <p>Carregando...</p>;
    return (
        <div className="filme-card flex">
            <div className="filme-banner">
                <img
                    src={imageUrl + filme.poster_path}
                    alt={filme.title}
                />
            </div>

            <div className="filme-info flex-column">
                <h1>{filme.title}</h1>

                <h2>Sinopse</h2>
                <p className="synopsis">{filme.overview}</p>

                {filmeDB && filmeDB.map((sala) => (
                    <div key={sala.Cod_Sala}>
                        <h3>Sala {sala.Numero_Sala}</h3>
                        <div className="showtimes flex">
                            {sala.Sessoes.map(sessao => (
                                <NavLink key={sessao.Cod_Sessao} to={`/sessao/${sessao.Cod_Sessao}`}>
                                    {sessao.Horario.slice(0, 5)} {/* exibe 11:00, 14:00 etc */}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
                <p>Duração: {filme.runtime} min</p>
            </div>
        </div>
    )
}

export default Filme