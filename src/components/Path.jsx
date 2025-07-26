import React, { useEffect, useState } from "react";
import axios from "axios";
import './RPGStyles.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function PathsManager() {
  const email = localStorage.getItem("email");

  const [pathPoints, setPathPoints] = useState(0);
  const [paths, setPaths] = useState([
    // Exemplo: cada node sabe sua posição (nível, coluna) e conexões (ids dos nodes filhos)
    {
      id: 1,
      nome: "Caminho A",
      descricao: "Descrição do Caminho A.",
      desbloqueado: false,
      nivel: 1,
      coluna: 2,
      filhos: [2, 3],
    },
    {
      id: 2,
      nome: "Caminho B",
      descricao: "Descrição do Caminho B.",
      desbloqueado: false,
      nivel: 2,
      coluna: 1,
      filhos: [],
    },
    {
      id: 3,
      nome: "Caminho C",
      descricao: "Descrição do Caminho C.",
      desbloqueado: false,
      nivel: 2,
      coluna: 3,
      filhos: [],
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [resPoints, resPaths] = await Promise.all([
          axios.get(`${API_URL}/api/users/ficha/path-points`, { params: { email } }),
          axios.get(`${API_URL}/api/users/ficha/paths`, { params: { email } }),
        ]);
        setPathPoints(resPoints.data.pathPoints || 0);
        if (resPaths.data.paths && resPaths.data.paths.length > 0) {
          setPaths(resPaths.data.paths);
        }
      } catch (e) {
        setErro("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [email]);

  async function desbloquearPath(id) {
    if (pathPoints <= 0) {
      alert("Você não possui pontos para desbloquear caminhos.");
      return;
    }
    const index = paths.findIndex((p) => p.id === id);
    if (index === -1) return;
    if (paths[index].desbloqueado) {
      alert("Caminho já desbloqueado!");
      return;
    }
    const novosPaths = [...paths];
    novosPaths[index].desbloqueado = true;

    try {
      await axios.put(`${API_URL}/api/users/ficha/gastar-ponto-path`, { email });
      await axios.put(`${API_URL}/api/users/ficha/update-paths`, {
        email,
        paths: novosPaths,
      });
      setPaths(novosPaths);
      setPathPoints((prev) => prev - 1);
      alert("Caminho desbloqueado!");
    } catch {
      alert("Erro ao desbloquear caminho.");
    }
  }

  if (loading) return <div className="loading">Carregando caminhos...</div>;

  // Pega a largura e altura do SVG (depende da quantidade de níveis e colunas)
  const maxNivel = Math.max(...paths.map((p) => p.nivel));
  const maxColuna = Math.max(...paths.map((p) => p.coluna));
  const svgWidth = maxColuna * 150 + 100;
  const svgHeight = maxNivel * 160 + 100;

  // Função para obter as coordenadas do node no SVG
  const getCoords = (node) => {
    return {
      x: node.coluna * 150,
      y: node.nivel * 160,
    };
  };

  // Função para desenhar as linhas de conexão entre nodes (usando SVG <line>)
  const linhasConexao = [];
  paths.forEach((node) => {
    const origem = getCoords(node);
    node.filhos.forEach((filhoId) => {
      const filho = paths.find((p) => p.id === filhoId);
      if (!filho) return;
      const destino = getCoords(filho);
      linhasConexao.push(
        <line
          key={`line-${node.id}-${filhoId}`}
          x1={origem.x}
          y1={origem.y + 30} // parte inferior do círculo
          x2={destino.x}
          y2={destino.y - 30} // parte superior do círculo
          stroke={node.desbloqueado ? "#66ccff" : "#444"}
          strokeWidth={node.desbloqueado ? 4 : 2}
          strokeLinecap="round"
          style={{
            filter: node.desbloqueado ? "drop-shadow(0 0 5px #66ccff)" : "none",
            transition: "stroke-width 0.3s ease",
          }}
        />
      );
    });
  });

  return (
    <div className="paths-container">
      <h2>Caminhos do Portador da Energia Z</h2>
      <p>
        Pontos de Path disponíveis: <strong>{pathPoints}</strong>
      </p>
      {erro && <div className="error">{erro}</div>}

      <svg
        className="path-svg"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        {linhasConexao}

        {paths.map((node) => {
          const { x, y } = getCoords(node);
          return (
            <g
              key={node.id}
              className={`path-node ${node.desbloqueado ? "unlocked" : "locked"}`}
              transform={`translate(${x},${y})`}
              onClick={() => desbloquearPath(node.id)}
            >
              <circle className="node-circle" r="30" cx="0" cy="0" />
              <text
                className="node-label"
                x="0"
                y="50"
                textAnchor="middle"
                pointerEvents="none"
              >
                {node.nome || `Caminho ${node.id}`}
              </text>

              {/* Tooltip */}
              <foreignObject
                x="-150"
                y="-90"
                width="300"
                height="80"
                className="node-tooltip"
              >
                <div xmlns="http://www.w3.org/1999/xhtml" className="tooltip-content">
                  <strong>{node.nome || `Caminho ${node.id}`}</strong>
                  <p>{node.descricao || "Sem descrição"}</p>
                  {!node.desbloqueado && <p style={{color:'#faa'}}>Clique para desbloquear</p>}
                  {node.desbloqueado && <p style={{color:'#6f6'}}>Desbloqueado</p>}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
