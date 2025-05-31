import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const filmesURL = import.meta.env.VITE_API;
const apiKey = 'a50779c7024dd1d98d96e004f1e48403';

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
        getFilme(filmeURL);
    }, [])
    return (
        <div className="filme-card">
            <div className="filme-banner">
                {filme.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
                        alt={filme.title}
                    />
                ) : (
                    <span>Banner do Filme</span>
                )}
            </div>

            <div className="filme-info">
                <h1>{filme.title}</h1>

                <h2>Sinopse</h2>
                <p className="synopsis">{filme.overview}</p>

                <h3>Sala 1</h3>
                <div className="showtimes">
                    {showtimes.map((time, index) => (
                        <button
                            key={index}
                            className={`time-button ${selectedTime === time ? "selected" : ""
                                }`}
                            onClick={() => setSelectedTime(time)}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Filme