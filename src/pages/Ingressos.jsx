import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CardIngresso from '../components/CardIngresso';
import './css/ingressos.css'
const Ingressos = () => {
  const [ingressos, setIngressos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const getIngressos = async () => {
    const cookieBruto = Cookies.get('usuario_logado');
    if (cookieBruto) {
      const userData = JSON.parse(decodeURIComponent(cookieBruto));
      await setUsuario(userData); // atualiza o estado global do componente com o usuário
      if (userData?.Cod_Usuario) {
        const res = await fetch(`http://localhost:5000/ingressos/${userData.Cod_Usuario}`);
        const data = await res.json();
        
        if (res.ok) {
          setIngressos(data.ingressos); // data.ingressos, não data direto
        } else {
          console.error("Erro ao buscar ingressos:", data.erro);
        }
      }
    }
  };

  useEffect(() => {
    getIngressos();
  }, []);

  return (
    <div className='ingressos-container flex-column'>
      <h1>Ingressos</h1>
      {ingressos.length > 0 ? (
        ingressos.map((ingresso, index) => (
          <CardIngresso key={index} ingresso={ingresso} />
        ))
      ) : (
        <p>Nenhum ingresso encontrado.</p>
      )}
    </div>
  );
};

export default Ingressos;
