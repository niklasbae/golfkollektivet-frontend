import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './../pages/Home';

const AppRoutes = () => {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </Router>
  );
};

export default AppRoutes;