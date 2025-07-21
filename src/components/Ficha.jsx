import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RPGStyles.css';

export default function FichaPagina1() {
  const navigate = useNavigate();
  const [tema, setTema] = useState('gold');
  const [form, setForm] = useState({
    nome: '',
    idade: '',
    classe: '',
    energiaZ: '',
    profissao: '',
    alinhamento: '',
    atributos: {
      força: 0,
      agilidade: 0,
      inteligência: 0,
      vigor: 0,
      carisma: 0,
      sabedoria: 0
    },
    vida: 0,
    ca: 0,
    iniciativa: 0,
    personalidade: '',
    imagem: '',
    titulos: '',
    pontos: 20 // Apenas pontos disponíveis, removendo pontosGastos
  });

 useEffect(() => {
  try {
    const fichaSalva = localStorage.getItem('ficha');
    if (fichaSalva) {
      const fichaObj = JSON.parse(fichaSalva);
      console.log('Ficha carregada do localStorage:', fichaObj);
      if (fichaObj && typeof fichaObj === 'object') {
        setForm(fichaObj);
      }
    }
  } catch (error) {
    console.error('Erro ao carregar ficha do localStorage:', error);
  }
}, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAtributoChange = (key) => {
    const valorAtual = form.atributos[key];
    const custo = valorAtual + 1;

    if (form.pontos >= custo) {
      const novosAtributos = { ...form.atributos, [key]: valorAtual + 1 };
      setForm({
        ...form,
        atributos: novosAtributos,
        pontos: form.pontos - custo
      });
    }
  };

  const mudarTema = (cor) => setTema(cor);

  const salvarFicha = async () => {
  try {
    const response = await axios.put('http://localhost:5000/api/users/updateFicha', {
      email: localStorage.getItem('email'),
      ficha: form,
    });
    setForm(response.data.ficha);
    localStorage.setItem('ficha', JSON.stringify(response.data.ficha));
    alert('Ficha salva com sucesso!');
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar ficha.');
  }
};

  return (
    <div className={`container py-4 tema-${tema}`}>
      <div className="rpg-card p-4">
        <h3 className="rpg-title mb-4">Ficha do Portador da Energia Z</h3>

        <div className="mb-3 d-flex gap-2">
          <button onClick={() => mudarTema('red')} className="btn btn-danger">Vermelho</button>
          <button onClick={() => mudarTema('blue')} className="btn btn-primary">Azul</button>
          <button onClick={() => mudarTema('gold')} className="btn btn-warning">Dourado</button>
        </div>

        <div className="row mb-3">
          <div className="col-md-2">
            <input className="form-control" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input className="form-control" name="idade" placeholder="Idade" value={form.idade} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input className="form-control" name="classe" placeholder="Classe" value={form.classe} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input className="form-control" name="energiaZ" placeholder="Energia Z %" value={form.energiaZ} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input className="form-control" name="profissao" placeholder="Profissão" value={form.profissao} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input className="form-control" name="alinhamento" placeholder="Alinhamento" value={form.alinhamento} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h5 className="text-warning mb-2">Atributos (Pontos disponíveis: {form.pontos})</h5>
            <div className="d-flex flex-column gap-3">
              {form.atributos && Object.entries(form.atributos).map(([key, value]) => (
                <div key={key} className="p-3 border border-warning rounded d-flex justify-content-between align-items-center">
                  <span className="text-warning text-capitalize">{key}: {value}</span>
                  <button className="rpg-button" onClick={() => handleAtributoChange(key)}>+{value + 1}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-6 d-flex flex-column gap-3">
            <div>
              <h5 className="text-warning">Imagem do Personagem (Upload)</h5>
              <input
                type="file"
                accept="image/*"
                className="form-control mb-3"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setForm({ ...form, imagem: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {form.imagem && (
                <img
                  src={form.imagem}
                  alt="Personagem"
                  className="img-fluid rounded border border-warning p-2"
                  style={{ maxHeight: '250px' }}
                />
              )}
            </div>

            <div className="p-3 border border-warning rounded d-flex justify-content-between">
              <span className="text-warning">Vida (HP):</span>
              <input type="number" className="form-control w-50" name="vida" value={form.vida} onChange={handleChange} />
            </div>
            <div className="p-3 border border-warning rounded d-flex justify-content-between">
              <span className="text-warning">CA:</span>
              <input type="number" className="form-control w-50" name="ca" value={form.ca} onChange={handleChange} />
            </div>
            <div className="p-3 border border-warning rounded d-flex justify-content-between">
              <span className="text-warning">Iniciativa:</span>
              <input type="number" className="form-control w-50" name="iniciativa" value={form.iniciativa} onChange={handleChange} />
            </div>

            <div>
              <h5 className="text-warning">Títulos e Conquistas</h5>
              <textarea className="form-control mb-3" rows="3" name="titulos" value={form.titulos} onChange={handleChange} placeholder="Ex: Sobreviveu ao Ritual 60%, Portador da Coroa de Z..."></textarea>
            </div>
          </div>
        </div>

        <h5 className="text-warning mt-4">Traços de Personalidade</h5>
        <textarea className="form-control mb-3" rows="2" name="personalidade" value={form.personalidade} onChange={handleChange} placeholder="Traços únicos do personagem"></textarea>

        <div className="d-flex gap-3 mt-4">
          <button className="rpg-button" onClick={salvarFicha}>
            Salvar Ficha
          </button>

          <button className="rpg-button" onClick={() => navigate('/ficha/pagina2')}>
            Próxima Página
          </button>
        </div>
      </div>
    </div>
  );
}
