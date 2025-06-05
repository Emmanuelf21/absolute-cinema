import React, { useEffect, useState } from 'react'
import './css/home.css'
import CardFilme from '../components/CardFilme'

const filmesURL = import.meta.env.VITE_API_MOVIE;
const apiKey = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [filmes, setFilmes] = useState([])

  const getMovies = async () => {
    const res = await fetch('http://localhost:5000/filmes');
    const filmesDB = await res.json();
    const movies =[]
    for (let i=0; i<filmesDB.length; i++){
      const idTmdb = filmesDB[i].tmdb
      const movieURL = `${filmesURL}${idTmdb}?${apiKey}`
      const response = await fetch(movieURL);
      const data = await response.json();
      movies.push(data)
    }

    setFilmes(movies)
    
  };

  // ao carregar a página o useEffect será executado por não possuir dependências para modificar no []
  useEffect(() => {
    // const playingMovies = `${filmesURL}?${apiKey}`;
    getMovies();
  }, [])

  return (
    <>
      <section className="banner">
        <h2>BANNER DE ALGUM FILME EM CARTAZ</h2>
      </section>

      <section className="em-cartaz">
        <h2>Em Cartaz</h2>
        <div className="filmes">
          {filmes.length > 0 && filmes.map((filme) => <CardFilme key={filme.id} filme={filme} />)}
        </div>
      </section>
    </>
  )
}

export default Home