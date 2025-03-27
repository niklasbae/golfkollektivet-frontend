import React from 'react';
import '../styles/global.css'; // optional, already loaded globally

// Dummy data structure for now
const teeTimes = [
  {
    course: "Oppegård Golfklubb",
    times: ["08:00", "08:10", "08:30", "09:00"]
  },
  {
    course: "Onsøy Golfklubb",
    times: ["08:03", "08:21", "08:48", "09:06"]
  }
];

const TeeTimeCalendar = () => {
  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2>Tee Times Near You</h2>
      <div className="calendar-grid">
        {teeTimes.map((course, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              minWidth: '250px'
            }}
          >
            <h3>{course.course}</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {course.times.map((time, i) => (
                <li key={i}>
                  <a
                    href={`https://golfbox.no/starttid/${course.course}/${time}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: 'none',
                      color: '#007bff',
                      display: 'block',
                      padding: '0.25rem 0'
                    }}
                  >
                    {time}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeeTimeCalendar;