// src/pages/Varsling.tsx
import NotifyMeForm from '../components/NotifyMeForm';

const Varsling = () => {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Få varsel når en tid åpner seg</h2>
      <NotifyMeForm />
    </div>
  );
};

export default Varsling;