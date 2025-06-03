import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const filmesURL = import.meta.env.VITE_API_MOVIE;
const apiKey = import.meta.env.VITE_API_KEY;
const imageUrl = import.meta.env.VITE_IMG;

const Filme = () => {
    const { id } = useParams();
    const [filme, setFilme] = useState(null);

    const getFilme = async (url) => {
        const res = await fetch(url);
        const data = await res.json();

        setFilme(data);
    }

    useEffect(() => {
        const filmeURL = `${filmesURL}${id}?${apiKey}`;
        console.log(id)
        getFilme(filmeURL);
    }, [])
    
    if (!filme) return <p>Carregando...</p>;
    return (
        <div className="filme-card">
            <div className="filme-banner">
                <img
                    src={imageUrl + filme.poster_path}
                    alt={filme.title}
                />
            </div>

            <div className="filme-info">
                {/* <h1>{filme.title}</h1> */}

                <h2>Sinopse</h2>
                {/* <p className="synopsis">{filme.overview}</p> */}

                <h3>Sala 1</h3>
                {/* <div className="showtimes">

                </div> */}
            </div>
        </div>
    )
}

export default Filme