import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RPGStyles.css';

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        username,
        email,
        password,
      });
      navigate('/');
    } catch (err) {
      setMensagem(err.response?.data?.error || 'Erro ao cadastrar');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="rpg-card">
        <h3 className="rpg-title">Cadastro de Aventureiro</h3>
        {mensagem && <div className="alert alert-info">{mensagem}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nome de Usuário</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <button className="rpg-button" type="submit">Cadastrar</button>
        </form>
        <p className="mt-2"><a href="/">Já tenho conta</a></p>
      </div>
    </div>
  );
}
