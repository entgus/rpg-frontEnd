import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RPGStyles.css';

export default function FichaPagina2() {
  const navigate = useNavigate();

  const [tema, setTema] = useState('gold');
  const [cartas, setCartas] = useState([]);
  const [pontos, setPontos] = useState(0);
  const [loadingPontos, setLoadingPontos] = useState(true);
  const [erro, setErro] = useState('');

  const [novaCarta, setNovaCarta] = useState({
    nome: '',
    raridade: 'Bronze',
    imagem: '',
    funcionalidade: '',
  });

  const [form, setForm] = useState({
    historico: '',
    aliados: '',
    notas: '',
  });

  // Carregar dados do localStorage e pontos do backend ao montar
  useEffect(() => {
    async function carregarDados() {
      try {
        const fichaSalva = JSON.parse(localStorage.getItem('ficha'));
        if (fichaSalva) {
          setForm({
            historico: fichaSalva.historico || '',
            aliados: fichaSalva.aliados || '',
            notas: fichaSalva.notas || '',
          });
          setCartas(fichaSalva.cartas || []);
        }

        // Buscar pontos disponíveis do backend
        const email = localStorage.getItem('email');
        if (email) {
          const res = await axios.get('http://localhost:5000/api/users/ficha/cartas-pontos', {
            params: { email },
          });
          setPontos(res.data.pontosDisponiveis);
        }
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
        setErro('Erro ao carregar os dados do servidor.');
      } finally {
        setLoadingPontos(false);
      }
    }
    carregarDados();
  }, []);

  // Inputs de formulário comum
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Inputs da nova carta
  const handleNovaCartaChange = (e) => {
    const { name, value } = e.target;
    setNovaCarta({ ...novaCarta, [name]: value });
  };

  // Upload imagem (converte para base64)
  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNovaCarta({ ...novaCarta, imagem: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Adicionar carta - só se tiver pontos disponíveis
  const adicionarCarta = async () => {
    if (!novaCarta.nome || !novaCarta.raridade) {
      alert('Preencha o nome e escolha a raridade.');
      return;
    }
    if (pontos <= 0) {
      alert('Você não possui pontos suficientes para criar cartas.');
      return;
    }

    try {
      // Atualizar backend para gastar 1 ponto
      const email = localStorage.getItem('email');
      await axios.put('http://localhost:5000/api/users/ficha/gastar-ponto-carta', { email });

      // Atualiza frontend
      const novaLista = [...cartas, novaCarta];
      setCartas(novaLista);

      setPontos(pontos - 1);

      // Limpa o formulário da carta
      setNovaCarta({ nome: '', raridade: 'Bronze', imagem: '', funcionalidade: '' });

      // Atualiza localStorage com as cartas e pontos
      const fichaAtual = JSON.parse(localStorage.getItem('ficha')) || {};
      const fichaAtualizada = {
        ...fichaAtual,
        cartas: novaLista,
        cartasPontosDisponiveis: pontos - 1,
      };
      localStorage.setItem('ficha', JSON.stringify(fichaAtualizada));

      alert('Carta criada com sucesso!');

    } catch (err) {
      console.error(err);
      alert('Erro ao criar carta. Tente novamente.');
    }
  };

  // Salvar página 2 (histórico, aliados, notas, cartas etc)
  const salvarFicha = async () => {
    try {
      const fichaAntiga = JSON.parse(localStorage.getItem('ficha')) || {};
      const novaFicha = { ...fichaAntiga, ...form, cartas, cartasPontosDisponiveis: pontos };

      await axios.put('http://localhost:5000/api/users/updateFicha', {
        email: localStorage.getItem('email'),
        ficha: novaFicha,
      });

      localStorage.setItem('ficha', JSON.stringify(novaFicha));
      alert('Ficha da página 2 salva com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar ficha.');
    }
  };

  const mudarTema = (cor) => setTema(cor);

  if (loadingPontos) return <div>Carregando dados...</div>;

  return (
    <div className={`container py-4 tema-${tema}`}>
      <div className="rpg-card p-4">
        <h3 className="rpg-title mb-2">Ficha do Portador da Energia Z — Página 2</h3>

        <div className="mb-3 d-flex gap-3 align-items-center">
          <strong className="text-warning">Pontos para criar cartas: {pontos}</strong>
          <button onClick={() => mudarTema('red')} className="btn btn-danger">Vermelho</button>
          <button onClick={() => mudarTema('blue')} className="btn btn-primary">Azul</button>
          <button onClick={() => mudarTema('gold')} className="btn btn-warning">Dourado</button>
        </div>

        {erro && <div className="alert alert-danger">{erro}</div>}

        <h5 className="text-warning mb-3">Suas Cartas</h5>
        <div className="d-flex flex-wrap gap-3">
          {cartas.map((carta, idx) => (
            <div
              key={idx}
              className={`carta-pequena carta-${carta.raridade.toLowerCase()}`}
              title={carta.nome}
            >
              {carta.imagem && (
                <img src={carta.imagem} alt={carta.nome} className="carta-img" />
              )}
              <div className="carta-nome">{carta.nome}</div>
              <div className="carta-raridade">{carta.raridade}</div>
              <div className="carta-funcionalidade">{carta.funcionalidade}</div>
            </div>
          ))}
        </div>

        <h5 className="text-warning mt-4">Criar Nova Carta</h5>
        <div className="mb-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nome da Carta"
            name="nome"
            value={novaCarta.nome}
            onChange={handleNovaCartaChange}
          />
          <select
            className="form-select mb-2"
            name="raridade"
            value={novaCarta.raridade}
            onChange={handleNovaCartaChange}
          >
            <option>Bronze</option>
            <option>Prata</option>
            <option>Dourada</option>
            <option>Diamante</option>
            <option>Mestre</option>
            <option>Lendaria</option>
          </select>

          <textarea
            className="form-control mb-2"
            rows="2"
            placeholder="Funcionalidade da Carta (poder, bônus etc)"
            name="funcionalidade"
            value={novaCarta.funcionalidade}
            onChange={handleNovaCartaChange}
          />

          <input
            type="file"
            accept="image/*"
            className="form-control mb-2"
            onChange={handleImagemChange}
          />

          <button
            className="rpg-button"
            onClick={adicionarCarta}
            disabled={pontos <= 0}
            title={pontos <= 0 ? 'Você não tem pontos para criar cartas' : ''}
          >
            Adicionar Carta
          </button>
        </div>

        <div className="mb-4 mt-4">
          <h5 className="text-warning">Histórico / Biografia</h5>
          <textarea
            className="form-control"
            rows="3"
            name="historico"
            value={form.historico}
            onChange={handleChange}
            placeholder="Histórico ou origem..."
          ></textarea>
        </div>

        <div className="mb-4">
          <h5 className="text-warning">Aliados / Relacionamentos / Grupos</h5>
          <textarea
            className="form-control"
            rows="3"
            name="aliados"
            value={form.aliados}
            onChange={handleChange}
            placeholder="Aliados, mestres, amigos..."
          ></textarea>
        </div>

        <div className="mb-4">
          <h5 className="text-warning">Notas / Observações Livres</h5>
          <textarea
            className="form-control"
            rows="3"
            name="notas"
            value={form.notas}
            onChange={handleChange}
            placeholder="Anotações adicionais..."
          ></textarea>
        </div>

        <div className="d-flex gap-3">
          <button className="rpg-button" onClick={salvarFicha}>Salvar Página 2</button>
          <button className="rpg-button" onClick={() => navigate('/ficha')}>Voltar à Página 1</button>
        </div>
      </div>
    </div>
  );
}

