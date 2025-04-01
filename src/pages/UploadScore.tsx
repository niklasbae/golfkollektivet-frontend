import { useState } from 'react';

const fieldLabels: Record<string, string> = {
  username: 'Brukernavn',
  password: 'Passord',
  clubName: 'Golfklubb',
  courseName: 'Bane',
  teeName: 'Tee',
  markerName: 'Markør',
  scoreDate: 'Dato (dd.MM.yyyy)',
  scoreTime: 'Tidspunkt (HH:mm)',
};

type ScoreFormData = {
  username: string;
  password: string;
  clubName: string;
  courseName: string;
  teeName: string;
  teeGender: string;
  markerName: string;
  scoreDate: string;
  scoreTime: string;
  holeScores: number[];
};

const UploadScore = () => {
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [formData, setFormData] = useState<ScoreFormData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState<(keyof ScoreFormData)[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setStatus(`📷 Bilde valgt: ${file.name}`);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    setStatus('Sender bildet til AI...');
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch('https://golfkollektivet-backend.onrender.com/api/scorecard/parse', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const parsedData: ScoreFormData = {
          username: 'niklas',
          password: 'niklass9751',
          clubName: data.clubName || '',
          courseName: data.courseName || '',
          teeName: data.teeName || '',
          teeGender: data.teeGender || 'Male',
          markerName: data.playerName || '',
          scoreDate: data.scoreDate || '',
          scoreTime: data.scoreTime || '',
          holeScores: data.holes || [],
        };
        setFormData(parsedData);

        const required: (keyof ScoreFormData)[] = ['clubName', 'teeName'];
        const missing = required.filter((key) => !parsedData[key]);
        setMissingFields(missing);

        if (missing.length > 0) {
          setStatus('⚠️ Noen felter mangler og må fylles ut.');
        } else {
          setStatus('✅ Data tolket! Se gjennom og rediger nedenfor.');
        }
      } else {
        setStatus('❌ Klarte ikke å tolke bildet.');
      }
    } catch (error) {
      setStatus('❌ Feil ved opplasting');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof ScoreFormData, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
    setMissingFields((prev) => prev.filter((f) => f !== field));
  };

  const updateHoleScore = (index: number, value: number) => {
    if (!formData) return;
    const updatedScores = [...formData.holeScores];
    updatedScores[index] = value;
    setFormData({ ...formData, holeScores: updatedScores });
  };

  const submitToGolfbox = async () => {
    if (!formData) return;

    const requiredFields: (keyof ScoreFormData)[] = [
      'username',
      'password',
      'clubName',
      'courseName',
      'teeName',
      'markerName',
      'scoreDate',
      'scoreTime',
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setStatus(`❌ Mangler verdi for: ${fieldLabels[field] || field}`);
        return;
      }
    }

    if (!Array.isArray(formData.holeScores) || formData.holeScores.length < 9) {
      setStatus('❌ Hullscorer må ha minst 9 verdier.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://golfkollektivet-backend.onrender.com/api/golfbox/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setStatus('✅ Score sendt til GolfBox!');
      } else {
        setStatus('❌ Klarte ikke å sende score.');
      }
    } catch (err) {
      setStatus('❌ Feil ved sending til GolfBox.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(null);
    setSubmitted(false);
    setStatus('');
    setImage(null);
    setMissingFields([]);
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2>Last opp scorekort 📸</h2>
      <p>Ta et screenshot av runden din i Golf Gamebook og last det opp her.</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: '#000A24',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {loading ? 'Sender...' : 'Send til AI 🧠'}
        </button>
      </div>

      {status && <p style={{ marginTop: '0.5rem' }}>{status}</p>}

      {formData && (
        <div style={{ marginTop: '2rem' }}>
          <h3>📜 Rediger scoredata</h3>

          <div className="form-grid">
            {(Object.keys(formData) as (keyof ScoreFormData)[])
              .filter((key) => key !== 'holeScores' && key !== 'teeGender')
              .map((key) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', fontWeight: 500 }}>
                  {fieldLabels[key] || key}:
                  <input
                    type={key === 'password' ? 'password' : 'text'}
                    value={String(formData[key])}
                    onChange={(e) => updateField(key, e.target.value)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: `1px solid ${missingFields.includes(key) ? 'red' : '#ccc'}`,
                      backgroundColor: missingFields.includes(key) ? '#ffe6e6' : 'white',
                    }}
                  />
                </label>
              ))}
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, marginTop: '2rem' }}>
            Hullscorer:
            <div className="hole-grid">
              {formData.holeScores.map((score: number, i: number) => (
                <input
                  key={i}
                  type="number"
                  value={score}
                  onChange={(e) => updateHoleScore(i, parseInt(e.target.value) || 0)}
                  style={{
                    padding: '0.4rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                    width: '100%',
                  }}
                />
              ))}
            </div>
          </label>

          <button
            onClick={submitToGolfbox}
            disabled={loading}
            style={{
              marginTop: '2rem',
              backgroundColor: '#2e7d32',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            {loading ? 'Sender...' : 'Send til GolfBox 🚀'}
          </button>

          {submitted && (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                ✅ Score er sendt! Du kan nå lukke siden eller laste opp en ny runde.
              </p>
              <button
                onClick={resetForm}
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ccc',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Last opp ny runde 🔄
              </button>
            </div>
          )}

          <style>{`
            .form-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 1rem;
            }

            .hole-grid {
              display: grid;
              grid-template-columns: repeat(9, 1fr);
              gap: 0.5rem;
              max-width: 100%;
            }

            @media (min-width: 768px) {
              .form-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default UploadScore;