import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GiSpellBook, GiPathDistance, GiSwordman } from 'react-icons/gi';

export default function NavbarRPG() {
  const email = localStorage.getItem('email');
  if (!email) return null;

  return (
    <nav className="navbar navbar-expand-lg bg-dark px-4 shadow" style={{ borderBottom: '2px solid gold' }}>
      <Link className="navbar-brand text-warning fw-bold fs-4" to="/" style={{ fontFamily: 'Cinzel, serif' }}>
        ⚔️ RPG do Z
      </Link>

      {/* Botão hamburguer para mobile */}
      <button
  className="navbar-toggler border border-warning"
  type="button"
  data-bs-toggle="collapse"
  data-bs-target="#menuRPG"
  aria-controls="menuRPG"
  aria-expanded="false"
  aria-label="Toggle navigation"
  style={{ backgroundColor: '#222', color: 'gold' }}
>
  <span className="navbar-toggler-icon" style={{ filter: 'invert(100%) sepia(100%) saturate(10000%) hue-rotate(45deg)' }}></span>
</button>


      {/* Menu colapsável */}
      <div className="collapse navbar-collapse" id="menuRPG">
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
