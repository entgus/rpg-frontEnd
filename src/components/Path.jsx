import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RPGStyles.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function PathsManager() {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [pathPoints, setPathPoints] = useState(0);
  const [paths, setPaths] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        if (!token) {
          setErro("Usuário não autenticado.");
          setLoading(false);
          return;
        }

        // Configuração do header com token
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Pega pontos de path (pode enviar email se backend aceitar)
        const resPoints = await axios.get(`${API_URL}/api/users/ficha/path-points`, {
          params: { email },
          headers: { Authorization: `Bearer ${token}` },
        });

        // Pega paths do usuário
        const resPaths = await axios.get(`${API_URL}/api/users/ficha/paths`, {
          params: { email },
          headers: { Authorization: `Bearer ${token}` },
        });

        // Pega conexões entre os paths (essa rota usa só token, sem email)
        const resConnections = await axios.get(`${API_URL}/api/users/ficha/conexoes`, config);

        setPathPoints(resPoints.data.pathPoints || 0);

        const pathsNormalizados = (resPaths.data.paths || []).map((p) => ({
          ...p,
          desbloqueado: p.desbloqueado || false,
          filhos: Array.isArray(p.filhos) ? p.filhos : [],
          nivel: typeof p.nivel === "number" ? p.nivel : 1,
          coluna: typeof p.coluna === "number" ? p.coluna : 1,
        }));

        setPaths(pathsNormalizados);
        setConnections(resConnections.data.pathConnections || []);
      } catch (e) {
        setErro("Erro ao carregar dados.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    if (email) fetchData();
    else {
      setErro("Usuário não autenticado.");
      setLoading(false);
    }
  }, [email, token]);

  function podeDesbloquear(id) {
    const path = paths.find((p) => p.id === id);
    if (!path || path.desbloqueado) return false;

    const pais = paths.filter((p) => p.filhos?.includes(id));
    if (pais.length === 0) return true;

    return pais.some((pai) => pai.desbloqueado);
  }

  async function desbloquearPath(id) {
    if (pathPoints <= 0) {
      alert("Você não possui pontos para desbloquear caminhos.");
      return;
    }

    if (!podeDesbloquear(id)) {
      alert("Você precisa desbloquear o caminho anterior primeiro.");
      return;
    }

    const index = paths.findIndex((p) => p.id === id);
    if (index === -1 || paths[index].desbloqueado) {
      alert("Caminho já desbloqueado!");
      return;
    }

    const novosPaths = paths.map((path) =>
      path.id === id ? { ...path, desbloqueado: true } : path
    );

    try {
      // Enviar token e email no body conforme seu backend espera
      await axios.put(
        `${API_URL}/api/users/ficha/gastar-ponto-path`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.put(
        `${API_URL}/api/users/ficha/update-paths`,
        {
          email,
          paths: novosPaths,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPaths(novosPaths);
      setPathPoints((prev) => prev - 1);
      alert("Caminho desbloqueado!");
    } catch (error) {
      alert("Erro ao desbloquear caminho.");
      console.error(error);
    }
  }

  function handleKeyDown(event, id) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      desbloquearPath(id);
    }
  }

  if (loading) return <div className="loading">Carregando caminhos...</div>;
  if (!Array.isArray(paths) || paths.length === 0)
    return <div className="error">Nenhum caminho disponível.</div>;

  const maxNivel = Math.max(...paths.map((p) => p.nivel));
  const maxColuna = Math.max(...paths.map((p) => p.coluna));
  const svgWidth = maxColuna * 150 + 100;
  const svgHeight = maxNivel * 160 + 100;

  const getCoords = (node) => ({
    x: node.coluna * 150,
    y: node.nivel * 160,
  });

  // Desenha linhas a partir da lista de conexões
  const linhasConexao = connections.map(({ from, to }) => {
    const origem = getCoords(paths.find((p) => p.id === from));
    const destino = getCoords(paths.find((p) => p.id === to));
    if (!origem || !destino) return null;

    return (
      <line
        key={`line-${from}-${to}`}
        x1={origem.x}
        y1={origem.y + 30}
        x2={destino.x}
        y2={destino.y - 30}
        stroke="#66ccff"
        strokeWidth={4}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 5px #66ccff)" }}
      />
    );
  });

  return (
    <div className="paths-container">
      <h2 className="titulo-espacial">Caminhos do Portador da Energia Z</h2>
      <p className="pontos-texto">
        Pontos disponíveis: <strong>{pathPoints}</strong>
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
              onKeyDown={(e) => handleKeyDown(e, node.id)}
              tabIndex={0}
              role="button"
              aria-label={`Caminho ${node.nome}. ${
                node.desbloqueado ? "Desbloqueado" : "Bloqueado"
              }`}
            >
              <circle className="node-circle" r="30" cx="0" cy="0" />
              <text className="node-label" x="0" y="50" textAnchor="middle">
                {node.nome || `Caminho ${node.id}`}
              </text>
              <title>
                {node.nome}
                {"\n"}
                {node.descricao || "Sem descrição"}
                {"\n"}
                {node.desbloqueado ? "Desbloqueado" : "Clique para desbloquear"}
              </title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
