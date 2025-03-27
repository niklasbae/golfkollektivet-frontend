import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import JoinWaitlist from '../components/JoinWaitlist';
import Footer from '../components/Footer';

const App = () => {
  return (
    <div className="container">
      <HeroSection />
      <AboutSection />
      <JoinWaitlist />
      <Footer />
    </div>
  );
};

export default App;