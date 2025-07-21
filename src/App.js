import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cadastro from './components/Cadastro';
import Login from './components/Login';
import Ficha from './components/Ficha';
import Ficha2 from './components/Ficha2';
import CartazesPublicos from './components/CartazesPublicos';
import Path from './components/Path';
import NavbarRPG from './components/NavbarRPG';

function App() {
  return (
    <Router>
      <NavbarRPG />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/ficha" element={<Ficha />} />
        <Route path="/ficha/pagina2" element={<Ficha2 />} />
        <Route path="/missoes" element={<CartazesPublicos userId={localStorage.getItem('userId')} />} />
        <Route path="/path" element={<Path />} />
        <Route path="/cartazes" element={<CartazesPublicos userId={localStorage.getItem('userId')} />} />
      </Routes>
    </Router>
  );
}

export default App;
