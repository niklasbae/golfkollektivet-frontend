import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './../components/Navbar';
import Footer from './../components/Footer';
import Home from './../pages/Home';

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <main style={{ paddingTop: '4rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default AppRoutes;
