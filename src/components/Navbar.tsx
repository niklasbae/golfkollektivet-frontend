// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/global.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleNavClick = (path: string) => {
    setMenuOpen(false); // Always close the menu
    if (location.pathname !== path) {
      navigate(path); // Navigate if not already there
    }
  };

  // Optional: auto-close on browser back/forward
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div onClick={() => handleNavClick('/')} className="logo" style={{ cursor: 'pointer' }}>
          Golfkollektivet
        </div>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <span onClick={() => handleNavClick('/starttider')}>Starttider</span>
          <span onClick={() => handleNavClick('/varsling')}>Få varsel</span>
          <span onClick={() => handleNavClick('/arrangementer')}>Arrangementer</span>
          <span onClick={() => handleNavClick('/merch')}>Merch</span>
          <span onClick={() => handleNavClick('/om-oss')}>Om oss</span>
          <span onClick={() => handleNavClick('/logg-inn')}>Logg inn</span>
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