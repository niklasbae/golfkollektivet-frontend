// src/pages/TeeTimes.tsx
import { useState } from 'react';
import TeeTimeSearchBar from '../components/TeeTimeSearchBar';
import TeeTimeResults from '../components/TeeTimeResults';

const TeeTimes = () => {
  const [filters, setFilters] = useState({
    date: '',
    query: '',
    spots: ''
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2>Utforsk ledige tee times</h2>
      <TeeTimeSearchBar onSearch={setFilters} />
      <TeeTimeResults filters={{
        date: filters.date,
        query: filters.query,
        minSpots: filters.spots
      }} />
    </div>
  );
};

export default TeeTimes;