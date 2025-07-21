import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CartazesPublicos({ userId }) {
  const [cartazes, setCartazes] = useState([]);
  const [formData, setFormData] = useState({
    tipo: '',
    titulo: '',
    recompensa: '',
    descricao: ''
  });

  useEffect(() => {
    buscarCartazes();
  }, []);

  const buscarCartazes = () => {
    axios.get('http://localhost:5000/api/cartazes-publicos')
      .then(response => setCartazes(response.data))
      .catch(error => console.error('Erro ao buscar cartazes públicos:', error));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const dadosParaEnviar = { ...formData, userId };

    axios.post('http://localhost:5000/api/cartazes-publicos', dadosParaEnviar, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        alert('Cartaz criado com sucesso!');
        setFormData({ tipo: '', titulo: '', recompensa: '', descricao: '' });
        buscarCartazes();
      })
      .catch(error => {
        console.error('Erro ao criar cartaz público:', error);
        alert(error.response?.data?.error || 'Erro ao criar cartaz.');
      });
  };

  return (
    <div>
      <h1>Quadro de Missões (Cartazes Públicos)</h1>

      <h2>Criar Novo Cartaz Público</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          placeholder="Tipo (baixo, médio, alto, crítico, extremo)"
          required
        />
        <input
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Título"
          required
        />
        <input
          name="recompensa"
          value={formData.recompensa}
          onChange={handleChange}
          placeholder="Recompensa"
          required
        />
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          placeholder="Descrição"
          required
        />
        <button type="submit">Criar Cartaz</button>
      </form>

      <h2>Cartazes Públicos Existentes</h2>
      {cartazes.length === 0 ? (
        <p>Nenhum cartaz criado ainda.</p>
      ) : (
        <ul style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', padding: 0, listStyle: 'none' }}>
          {cartazes.map((cartaz) => {
            const tipoClasse = `cartaz-${cartaz.tipo.toLowerCase()}`;
            return (
              <li key={cartaz._id}>
                <div className={`cartaz ${tipoClasse}`}>
                  <h3>{cartaz.titulo}</h3>
                  <p><strong>Recompensa:</strong> {cartaz.recompensa}</p>
                  <p>{cartaz.descricao}</p>
                  <p><em>Criado por: {cartaz.userId?.username || 'Desconhecido'}</em></p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CartazesPublicos;
