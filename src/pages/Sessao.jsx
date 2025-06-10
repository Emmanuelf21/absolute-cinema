import React, { useEffect, useState } from 'react';
import './css/sessao.css';
import { useParams } from 'react-router-dom';

const filmesURL = import.meta.env.VITE_API_MOVIE;
const apiKey = import.meta.env.VITE_API_KEY;
const imageUrl = import.meta.env.VITE_IMG;

const Sessao = () => {
  const { id } = useParams();
  const [cadeiras, setCadeiras] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [filme, setFilme] = useState(null);
  const [infoSessao, setInfoSessao] = useState(null); // Agora, definimos como objeto (null ao invés de array)

  const getCadeiras = async () => {
    const res = await fetch(`http://localhost:5000/sessao/${id}/cadeiras`);
    const data = await res.json();
    setCadeiras(data);
  };

  const getInfoSessao = async () => {
    const res = await fetch(`http://localhost:5000/sessao/${id}`);
    const data = await res.json();
    setInfoSessao(data);

    // Verificar se data tem o valor necessário antes de chamar getFilme
    if (data && data[0]?.tmdb) {
      getFilme(data[0].tmdb); // Passando o tmdb diretamente
    }
  };

  const getFilme = async (tmdb) => {
    const movieURL = `${filmesURL}${tmdb}?${apiKey}`;
    const response = await fetch(movieURL);
    const dataMovie = await response.json();
    setFilme(dataMovie);
    getCadeiras(); // Só depois que temos o filme, buscamos as cadeiras
  };

  useEffect(() => {
    getInfoSessao();
  }, [id]);

  const toggleSelecionada = (cod) => {
    setSelecionadas((prev) =>
      prev.includes(cod) ? prev.filter((c) => c !== cod) : [...prev, cod]
    );
  };

  const confirmarCompra = async () => {
    await fetch(`http://localhost:5000/sessao/${id}/comprar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cadeiras: selecionadas }),
    });
    alert('Compra confirmada!');
    window.location.reload();
  };

  const renderCadeiras = () => {
    const linhas = ['E', 'D', 'C', 'B', 'A'];
    return linhas.map((linha) => (
      <div className="fileira" key={linha}>
        <p>{linha}</p>
        <div key={linha} className="linha">
          {cadeiras
            .filter((c) => c.Fileira === linha)
            .map((c) => (
              <button
                key={c.Cod_Cadeira}
                disabled={c.Status_Filme === 'Ocupada'}
                onClick={() => toggleSelecionada(c.Cod_Cadeira)}
                className={`cadeira 
                ${c.Status_Filme === 'Ocupada' ? 'Ocupada' : 'Disponível'}
                ${selecionadas.includes(c.Cod_Cadeira) ? 'selecionada' : ''}`}
              >
                {c.Numero}
              </button>
            ))}
        </div>
      </div>
    ));
  };

  // Adicionando uma verificação se os dados de filme ou infoSessao ainda não chegaram
  if (!filme || !infoSessao) return <p>Carregando...</p>;

  return (
    <div className="sessao-container">
      <div className="banner">
        <img src={imageUrl + filme.poster_path} alt="#" />
      </div>
      <div className="sala-container">
        <h2>Sala {infoSessao[0]?.sala || 'Carregando sala...'}</h2>
        {/* Verificação para garantir que infoSessao existe e tem a propriedade 'sala' */}
        <div className="horario">{infoSessao[0]?.horario || 'Carregando horario...'}</div>
        <div className="grid-cadeiras">{renderCadeiras()}</div>
        <div className="tela">TELA</div>
        <div className="legenda">
          <span>
            <span className="legenda-box selecionada" /> Selecionada
          </span>
          <span>
            <span className="legenda-box ocupada" /> Indisponível
          </span>
          <span>
            <span className="legenda-box disponivel" /> Disponível
          </span>
        </div>
        <button className="confirmar" onClick={confirmarCompra}>
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default Sessao;
