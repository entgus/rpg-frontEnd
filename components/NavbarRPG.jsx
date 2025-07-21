import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GiSpellBook, GiPathDistance, GiSwordman } from 'react-icons/gi';



export default function NavbarRPG() {
  const email = localStorage.getItem('email');

  if (!email) return null; // Não mostra nada se não estiver logado.

  return (
    <nav className="navbar navbar-expand-lg bg-dark px-4 shadow" style={{ borderBottom: '2px solid gold' }}>
      <Link className="navbar-brand text-warning fw-bold fs-4" to="/" style={{ fontFamily: 'Cinzel, serif' }}>
        ⚔️ RPG do Z
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-4">
          <li className="nav-item">
            <Link className="nav-link text-warning fw-semibold d-flex align-items-center gap-2" to="/ficha">
              <GiSwordman size={20} /> Ficha
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-warning fw-semibold d-flex align-items-center gap-2" to="/missoes">
              <GiSpellBook size={20} /> Missões
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-warning fw-semibold d-flex align-items-center gap-2" to="/path">
              <GiPathDistance size={20} /> Path
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
