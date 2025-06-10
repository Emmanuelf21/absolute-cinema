import React, { useEffect, useState } from 'react';
import './css/sessao.css';
import { useParams } from 'react-router-dom';

const Sessao = () => {
  const { cod_sessao } = useParams();
  const [cadeiras, setCadeiras] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/sessao/${cod_sessao}/cadeiras`)
      .then(res => res.json())
      .then(data => setCadeiras(data));
  }, [cod_sessao]);

  const toggleSelecionada = (cod) => {
    setSelecionadas(prev =>
      prev.includes(cod) ? prev.filter(c => c !== cod) : [...prev, cod]
    );
  };

  const confirmarCompra = async () => {
    await fetch(`http://localhost:5000/sessao/${cod_sessao}/comprar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cadeiras: selecionadas }),
    });
    alert('Compra confirmada!');
    window.location.reload();
  };

  const renderCadeiras = () => {
    const linhas = ['E', 'D', 'C', 'B', 'A'];
    return linhas.map(linha => (
      <div key={linha} className="linha">
        {cadeiras
          .filter(c => c.Letra === linha)
          .map(c => (
            <button
              key={c.Cod_Cadeira}
              disabled={c.Status_Filme === 'ocupada'}
              onClick={() => toggleSelecionada(c.Cod_Cadeira)}
              className={`cadeira 
                ${c.Status_Filme === 'ocupada' ? 'ocupada' : ''}
                ${selecionadas.includes(c.Cod_Cadeira) ? 'selecionada' : ''}`}
            >
              {c.Numero}
            </button>
          ))}
      </div>
    ));
  };

  return (
    <div className="sessao-container">
      <div className="banner">Banner do Filme</div>
      <div className="sala-container">
        <h2>Sala 1</h2>
        <div className="horario">11h00</div>
        <div className="grid-cadeiras">{renderCadeiras()}</div>
        <div className="tela">TELA</div>
        <div className="legenda">
          <span><span className="legenda-box selecionada" /> Selecionada</span>
          <span><span className="legenda-box ocupada" /> Indisponível</span>
          <span><span className="legenda-box disponivel" /> Disponível</span>
        </div>
        <button className="confirmar" onClick={confirmarCompra}>Confirmar</button>
      </div>
    </div>
  );
}

export default Sessao
