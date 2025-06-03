import React, { useEffect, useState } from 'react'
import './css/home.css'
import CardFilme from '../components/CardFilme'

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [filmes, setFilmes] = useState([])

  const getPlayingMovies = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.results)
    setFilmes(data.results);
  };

  // ao carregar a página o useEffect será executado por não possuir dependências para modificar no []
  useEffect(() => {
    const playingMovies = `${moviesURL}?${apiKey}`;

    getPlayingMovies(playingMovies);
  }, [])

  return (
    <>
      <section className="banner">
        <h2>BANNER DE ALGUM FILME EM CARTAZ</h2>
      </section>

      <section className="em-cartaz">
        <h2>Em Cartaz</h2>
        <div className="filmes">
          {filmes.length>0 && filmes.map((filme)=> <CardFilme key={filme.id} filme={filme}/>)}
        </div>
      </section>
    </>
  )
}

export default Home