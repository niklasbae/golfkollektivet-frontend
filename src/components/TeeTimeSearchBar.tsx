// src/components/TeeTimeSearchBar.tsx
import React, { useState, useEffect } from 'react';

interface Props {
  onSearch: (filters: { date: string; query: string; spots: string }) => void;
}

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const TeeTimeSearchBar: React.FC<Props> = ({ onSearch }) => {
  const [date, setDate] = useState(getTodayDate());
  const [query, setQuery] = useState('');
  const [spots, setSpots] = useState('');

  useEffect(() => {
    onSearch({ date, query, spots });
  }, [date, query, spots]);

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      borderRadius: '1rem',
      backgroundColor: '#fff',
      boxShadow: '0 0 10px rgba(0,0,0,0.05)',
      marginBottom: '1rem',
    }}>
      {/* Spots dropdown moved first */}
      <select
        value={spots}
        onChange={(e) => setSpots(e.target.value)}
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '9999px',
          border: '1px solid #ccc',
          fontSize: '1rem'
        }}
      >
        <option value="">Alle plasser</option>
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
          fontSize: '1rem',
          minWidth: '140px'
        }}
      />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Søk etter bane eller sted..."
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '9999px',
          border: '1px solid #ccc',
          fontSize: '1rem',
          flex: '1 1 300px'
        }}
      />

      <button
        style={{
          backgroundColor: '#000A24',
          color: 'white',
          padding: '0.75rem 2rem',
          borderRadius: '9999px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Utforsk 🔍
      </button>
    </div>
  );
};

export default TeeTimeSearchBar;