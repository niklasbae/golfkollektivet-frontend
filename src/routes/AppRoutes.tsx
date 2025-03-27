// src/routes/AppRoutes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './../components/Navbar';
import Footer from './../components/Footer';
import Home from './../pages/Home';
import TeeTimes from './../pages/TeeTimes';
import Events from './../pages/Events';
import Merch from './../pages/Merch';
import About from './../pages/About';
import Login from './../pages/Login';
import Varsling from './../pages/Varsling';

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <main style={{ paddingTop: '4rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/starttider" element={<TeeTimes />} />
          <Route path="/arrangementer" element={<Events />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/om-oss" element={<About />} />
          <Route path="/logg-inn" element={<Login />} />
          <Route path="/varsling" element={<Varsling />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default AppRoutes;