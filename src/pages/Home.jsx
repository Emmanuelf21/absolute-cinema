import React, { useEffect, useState } from 'react'
import './css/home.css'
import CardFilme from '../components/CardFilme'

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [filmes, setFilmes] = useState([])

  const saveFilmes = async () =>{
    
    try {
      const res = await fetch('http://localhost:5000/filmes');
      const filmesDB = await res.json();

      // Listas de nomes (ou use .id se for mais seguro)
      const nomesNovos = filmes.map(f => f.title);
      const nomesDB = filmesDB.map(f => f.nome);
      
      // Inserir novos
      for (const filme of filmes) {
        if (!nomesDB.includes(filme.title)) {
          await fetch('http://localhost:5000/filmes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              Nome_Filme: filme.title,
              Descricao: filme.overview,
              Id_tmdb: filme.id,
              Classificacao: 'Ativo'
            })
          });
        }
      }

      // Inativar filmes antigos que não estão na nova lista
      for (const filme of filmesDB) {
        if (!nomesNovos.includes(filme.nome)) {
          await fetch(`http://localhost:5000/filmes/${filme.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Classificacao: 'Inativo' })
          });
        }
      }
    } catch (error) {
      console.error("Erro ao salvar filmes:", error);
    }
  }

  const getPlayingMovies = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    
    setFilmes(data.results);
    saveFilmes()
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