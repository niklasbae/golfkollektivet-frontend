// src/components/NotifyMeForm.tsx
import { useState } from 'react';

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const NotifyMeForm = () => {
  const [date, setDate] = useState(getTodayDate());
  const [from, setFrom] = useState('07:00');
  const [to, setTo] = useState('21:00');
  const [availableSpots, setAvailableSpots] = useState('');

  const handleSubscribe = () => {
    if (!date || !from || !to || !availableSpots) {
      alert('Velg dato, tidsintervall og antall ledige plasser');
      return;
    }

    alert(`✅ Du vil få beskjed hvis en tid åpner seg mellom ${from} og ${to} den ${date} med ${availableSpots} ledige plasser.`);
  };

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h3 style={{ margin: '1rem 0 0.75rem', fontSize: '1.2rem' }}>Få varsel når en tid åpner seg</h3>
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        padding: '1rem 1.5rem',
        boxShadow: '0 0 10px rgba(0,0,0,0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <select
          value={availableSpots}
          onChange={(e) => setAvailableSpots(e.target.value)}
          style={{ padding: '0.75rem 1rem', borderRadius: '9999px', border: '1px solid #ccc' }}
        >
          <option value="">Plasser</option>
          <option value="1">1 ledig</option>
          <option value="2">2 ledige</option>
          <option value="3">3 ledige</option>
          <option value="4">4 ledige</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Dato"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '9999px',
            border: '1px solid #ccc',
            minWidth: '140px'
          }}
        />

        <input
          type="time"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Fra"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '9999px',
            border: '1px solid #ccc',
            minWidth: '100px'
          }}
        />

        <input
          type="time"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Til"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '9999px',
            border: '1px solid #ccc',
            minWidth: '100px'
          }}
        />

        <button
          onClick={handleSubscribe}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: '#000A24',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Abonner
        </button>
      </div>
    </div>
  );
};

export default NotifyMeForm;