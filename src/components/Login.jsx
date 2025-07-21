import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RPGStyles.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      // Salvar email no localStorage (opcional, se você usa)
      localStorage.setItem('email', email);

      // Salvar ficha do usuário no localStorage (se vier)
      localStorage.setItem('ficha', JSON.stringify(response.data.ficha || {}));

      // Salvar o ID do usuário para usar em outras rotas/componentes
      if (response.data.user && response.data.user._id) {
        localStorage.setItem('userId', response.data.user._id);
      } else {
        console.warn('userId não encontrado no response.data');
      }

      // SALVAR O TOKEN JWT para autenticação futura
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      } else {
        console.warn('Token JWT não encontrado no response.data');
      }

      // Redireciona para a página da ficha do personagem
      navigate('/ficha');
    } catch (err) {
      // Mostrar mensagem de erro, se disponível
      setMensagem(err.response?.data?.error || 'Erro ao fazer login');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="rpg-card">
        <h3 className="rpg-title">Entrada do Aventureiro</h3>
        {mensagem && <div className="alert alert-info">{mensagem}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>E-mail</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Senha</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="rpg-button" type="submit">
            Entrar
          </button>
        </form>
        <p className="mt-2">
          <a href="/cadastro">Criar nova conta</a>
        </p>
      </div>
    </div>
  );
}
