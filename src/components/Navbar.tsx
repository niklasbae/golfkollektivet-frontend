// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/global.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Automatically close the menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">Golfkollektivet</Link>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/starttider">Starttider</Link>
          <Link to="/arrangementer">Arrangementer</Link>
          <Link to="/merch">Merch</Link>
          <Link to="/om-oss">Om oss</Link>
          <Link to="/logg-inn">Logg inn</Link>
        </nav>

        <button className="burger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;