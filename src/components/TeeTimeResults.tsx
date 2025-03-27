// src/components/TeeTimeResults.tsx
import oppislogo from '../assets/oppis.png'; 
import onslogo from '../assets/onsgk.png';
import sorkneslogo from '../assets/sorknes.png';
import { useState } from 'react';

const teeTimes = [
  {
    course: 'Oppegård Golfklubb',
    location: 'Kolbotn',
    logo: oppislogo,
    times: [
      { time: '08:00', available: 2 },
      { time: '08:10', available: 4 },
      { time: '08:20', available: 1 },
      { time: '08:30', available: 0 },
      { time: '08:40', available: 3 },
      { time: '09:00', available: 2 },
      { time: '10:00', available: 1 },
      { time: '12:00', available: 4 },
      { time: '14:00', available: 2 },
      { time: '16:00', available: 0 },
      { time: '18:00', available: 1 },
      { time: '20:00', available: 3 },
    ]
  },
  {
    course: 'Onsøy Golfklubb',
    location: 'Fredrikstad',
    logo: onslogo,
    times: [
      { time: '08:03', available: 3 },
      { time: '08:21', available: 1 },
      { time: '08:48', available: 2 },
      { time: '09:06', available: 2 },
      { time: '09:30', available: 1 },
      { time: '10:30', available: 0 },
      { time: '11:30', available: 3 },
      { time: '13:00', available: 2 },
      { time: '15:00', available: 1 },
      { time: '17:00', available: 4 },
      { time: '19:00', available: 2 },
    ]
  },
  {
    course: 'Sorknes Golfklubb',
    location: 'Rena',
    logo: sorkneslogo,
    times: [
      { time: '08:15', available: 2 },
      { time: '08:24', available: 4 },
      { time: '08:33', available: 2 },
      { time: '08:45', available: 1 },
      { time: '09:15', available: 1 },
      { time: '11:45', available: 2 },
      { time: '13:15', available: 3 },
      { time: '15:15', available: 0 },
      { time: '17:45', available: 2 },
      { time: '18:15', available: 3 },
      { time: '19:30', available: 2 },
    ]
  },
];

interface TeeTimeResultsProps {
  filters: {
    date: string;
    query: string;
    minSpots: string;
  };
}

const TeeTimeResults: React.FC<TeeTimeResultsProps> = ({ filters }) => {
  const [highlightedTime, setHighlightedTime] = useState<string | null>(null);
  const minSpots = parseInt(filters?.minSpots || '0');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginTop: '2rem' }}>
      {teeTimes
      .filter(course => {
        const q = filters.query.toLowerCase();
        return (
          course.course.toLowerCase().includes(q) ||
          course.location.toLowerCase().includes(q)
        );
      })
      .map((course, index) => (
        <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
          <img src={course.logo} alt={`${course.course} logo`} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>{course.course}</h3>
            <p style={{ margin: '0.25rem 0 1rem', color: '#666' }}>{course.location}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {course.times
                .filter((slot) => slot.available >= minSpots)
                .map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setHighlightedTime(slot.time)}
                    disabled={slot.available === 0}
                    aria-label={`${slot.time}, ${slot.available} av 4 ledig`}
                    title={`${slot.available} av 4 ledig`}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      border: '1px solid #000A24',
                      fontSize: '0.9rem',
                      backgroundColor: highlightedTime === slot.time ? '#000A24' : 'transparent',
                      color: highlightedTime === slot.time ? '#fff' : '#000A24',
                      cursor: slot.available === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: slot.available === 0 ? 0.5 : 1,
                    }}
                  >
                    {slot.time}{' '}
                    {Array(4)
                      .fill(null)
                      .map((_, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.8rem',
                            color: i < slot.available ? '#000A24' : '#ccc',
                          }}
                        >
                          ●
                        </span>
                      ))}
                  </button>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeeTimeResults;
